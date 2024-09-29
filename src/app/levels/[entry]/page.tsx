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
import { UnknownGuildOrDisabledLevels } from "./unknown-guild.tsx";

if (!process.env.LEVELS_METADATA_KEY) {
	throw new Error("Missing LEVELS_METADATA_KEY environment variable");
}

const MAX_LEADERBOARD_PAGE = 100;

export default async function Leaderboard({ params, searchParams }: LeaderboardProps) {
	const { page: rawPage } = await searchParams;
	const { entry } = await params;

	let page = Number.parseInt(rawPage, 10);

	if (Number.isNaN(page) || page < 1 || page > MAX_LEADERBOARD_PAGE) {
		page = 1;
	}

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const data = await getData(entry, token, page);

	if (!data) {
		return <UnknownGuildOrDisabledLevels />;
	}

	const { guild, isManager, vanity, levels, multipliers, roleRewards } = data;

	if (isSnowflake(entry) && vanity) {
		redirect(`/levels/${vanity}?page=${page}`, RedirectType.replace);
	}

	return (
		<div className="container mx-auto flex flex-col py-4">
			<header className="flex flex-col items-center justify-center gap-6">
				<div className="flex gap-4">
					<ImageWithFallback
						alt={`${guild.name} guild icon`}
						className="size-9 rounded-lg border"
						src={guildIcon(guild.id, guild.icon, { size: 64 })}
						fallback={fallbackAvatarImg}
						width={36}
						height={36}
						unoptimized={Boolean(guild.icon)}
					/>

					<h1 className="font-bold text-2xl text-white md:text-3xl">{guild.name}</h1>
				</div>

				<p className="px-8 md:px-0">
					View the leveling leaderboard of {guild.name}, including rewards and multipliers!
				</p>
			</header>

			<main className="mx-auto mt-8 flex flex-col gap-12 lg:flex-row">
				<div className="w-full px-4 md:px-0">
					<LeaderboardTable data={levels} guildId={guild.id} isManager={isManager} />

					{levels.length === 0 ? (
						page > 2 ? (
							<p className="mb-4 text-balance text-center">
								There are no users in this page. Try going back to{" "}
								<Link className="text-blurple underline" href={`/levels/${vanity ?? guild.id}?page=1`}>
									page 1
								</Link>
								?
							</p>
						) : page > 1 ? (
							<p className="mb-4 text-balance text-center">There are no users in this page. Try going back</p>
						) : (
							<p className="mb-4 text-center">There are no users with experience yet</p>
						)
					) : null}

					<PageSelector amount={levels.length} entry={entry} page={page} />
				</div>

				<div className="flex w-full flex-col gap-5 px-4 sm:w-80 md:w-96 md:px-0">
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

export async function generateMetadata({ params }: LeaderboardProps): Promise<Metadata> {
	const { entry } = await params;

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
			title: "Leaderboard",
			description: "View the leveling leaderboard of a Discord server, including rewards and multipliers!",
		};
	}

	const guild = (await response.json()) as LevelsGuildMetadataResponse;

	const titleSuffix = " • Leaderboard";

	return {
		title: `${ellipsis(guild.name, MAX_WINDOW_TITLE_LENGTH - titleSuffix.length)}${titleSuffix}`,
		description: `View the leveling leaderboard of ${guild.name}, including rewards and multipliers!`,
	};
}

async function getData(entry: string, token: string | undefined, page: number) {
	const response = await makeApiRequest(`/levels/${entry}?page=${page}`, token, {
		next: {
			tags: [`levels:${entry}`],
			revalidate: 60,
		},
	});

	if (!response.ok) {
		return null;
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
	params: Promise<{ entry: string }>;
	searchParams: Promise<{ page: string }>;
}
