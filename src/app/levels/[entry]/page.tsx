import { LeaderboardTable } from "@/app/levels/[entry]/01-leaderboard-table.tsx";
import { PageSelector } from "@/app/levels/[entry]/page-selector.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";
import type { Guild } from "@/lib/guild.ts";
import { MAX_WINDOW_TITLE_LENGTH, TOKEN_COOKIE } from "@/utils/constants.ts";
import { type Snowflake, guildIcon } from "@/utils/discord-cdn.ts";
import { ellipsis } from "@/utils/ellipsis.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import { type RoleReward, RoleRewardDisplay } from "./03-role-reward.tsx";
import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";

if (!process.env.LEVELS_METADATA_KEY) {
	throw new Error("Missing LEVELS_METADATA_KEY environment variable");
}

export default async function Leaderboard({ params: { entry }, searchParams }: LeaderboardProps) {
	const page = Number.parseInt(searchParams.page, 10);

	if (Number.isNaN(page)) {
		// This should never happen since the middleware handles this, but just in case
		redirect(`/levels/${entry}?page=1`, RedirectType.replace);
	}

	const token = cookies().get(TOKEN_COOKIE)?.value;
	const { guild, isManager, vanity, levels, multipliers, roleRewards } = await getData(entry, token, page);

	if (isSnowflake(entry) && vanity) {
		redirect(`/levels/${vanity}?page=${page}`, RedirectType.replace);
	}

	return (
		<div className="flex flex-col mx-auto container py-4">
			<header className="flex flex-col items-center justify-center gap-6">
				<div className="flex gap-4">
					<ImageWithFallback
						alt={`${guild.name} guild icon`}
						className="rounded-lg size-9 border"
						src={guildIcon(guild.id, guild.icon, { size: 64 })}
						fallback={fallbackAvatarImg}
						width={36}
						height={36}
						unoptimized={Boolean(guild.icon)}
					/>

					<h1 className="text-2xl md:text-3xl font-bold text-white">{guild.name}</h1>
				</div>

				<p className="px-8 md:px-0">
					View the leveling leaderboard of {guild.name}, including rewards and multipliers!
				</p>
			</header>

			<main className="mx-auto flex flex-col lg:flex-row gap-12 mt-8">
				<div className="px-4 md:px-0 w-full">
					<LeaderboardTable data={levels} guildId={guild.id} isManager={isManager} />

					{levels.length === 0 ? (
						page > 2 ? (
							<p className="text-center mb-4 text-balance">
								There are no users in this page. Try going back to{" "}
								<Link className="text-blurple underline" href={`/levels/${vanity ?? guild.id}?page=1`}>
									page 1
								</Link>
								?
							</p>
						) : page > 1 ? (
							<p className="text-center mb-4 text-balance">There are no users in this page. Try going back</p>
						) : (
							<p className="text-center mb-4">There are no users with experience yet</p>
						)
					) : null}

					<PageSelector amount={levels.length} entry={entry} page={page} />
				</div>

				<div className="px-4 md:px-0 w-full sm:w-80 md:w-96 flex flex-col gap-5">
					<SidebarSection title="Role Rewards">
						{roleRewards.length ? (
							<div className="flex flex-col gap-4">
								{roleRewards.map((roleReward) => (
									<RoleRewardDisplay key={roleReward.id} {...roleReward} />
								))}
							</div>
						) : (
							<p className="text-center">No role rewards set</p>
						)}
					</SidebarSection>

					<SidebarSection title="Multipliers">
						{multipliers.length ? (
							<div className="flex flex-col gap-4">
								{multipliers.map((multipliers) => (
									<MultiplierDisplay key={multipliers.id} {...multipliers} />
								))}
							</div>
						) : (
							<p className="text-center">No multipliers set</p>
						)}
					</SidebarSection>

					<SidebarSection title="How it works">
						<div className="space-y-2">
							<p>Every time you send a message you gain between 15 and 40 experience.</p>
							<p>To avoid spam, there is a cooldown of 1 minute per message sent.</p>
						</div>
					</SidebarSection>
				</div>
			</main>
		</div>
	);
}

export async function generateMetadata({ params: { entry } }: LeaderboardProps): Promise<Metadata> {
	const response = await makeApiRequest(`/levels/${entry}/metadata`, null, {
		headers: {
			Authorization: process.env.LEVELS_METADATA_KEY!,
		},
		next: {
			revalidate: 6 * 60 * 60, // 6 hours
		},
	});

	if (!response.ok) {
		return {
			title: "Leaderboard • Lurkr",
			description: "View the leveling leaderboard of a Discord server, including rewards and multipliers!",
		};
	}

	const guild = (await response.json()) as LevelsGuildMetadataResponse;

	const titleSuffix = " • Leaderboard • Lurkr";

	return {
		title: `${ellipsis(guild.name, MAX_WINDOW_TITLE_LENGTH - titleSuffix.length)}${titleSuffix}`,
		description: `View the leveling leaderboard of ${guild.name}, including rewards and multipliers!`,
	};
}

async function getData(entry: string, token: string | undefined, page: number) {
	const response = await makeApiRequest(`/levels/${entry}?page=${page}`, token, {
		next: { revalidate: 60, tags: [`levels:${entry}`] },
	});

	if (response.status === 401) {
		throw new Error("Unauthorized");
	}

	if (!response.ok) {
		throw new Error("Failed to fetch leaderboard data");
	}

	return response.json() as Promise<GetLevelsResponse>;
}

interface LevelsGuildMetadataResponse {
	readonly name: string;
}

export interface GetLevelsResponse {
	guild: Omit<Guild, "channels" | "emojis" | "roles">;
	isManager: boolean;
	vanity: string | null;
	levels: Level[];
	multipliers: Multiplier[];
	roleRewards: RoleReward[];
}

interface Level {
	readonly level: number;
	readonly messageCount: number;
	readonly nextLevelXp: number;
	readonly progress: number;
	readonly rank: number;
	readonly user: {
		accentColour: `#${string}` | null;
		avatar: string | null;
		discriminator: string;
		username: string;
	};
	readonly userId: Snowflake;
	readonly xp: number;
}

interface LeaderboardProps {
	params: { entry: string };
	searchParams: { page: string };
}
