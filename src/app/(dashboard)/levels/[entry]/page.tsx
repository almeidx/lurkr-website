import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import prettyMilliseconds from "pretty-ms";
import { LeaderboardTable } from "@/app/(dashboard)/levels/[entry]/01-leaderboard-table.tsx";
import {
	LEADERBOARD_ENTRIES_PER_PAGE,
	LEADERBOARD_MAX_PAGE,
	PageSelector,
} from "@/app/(dashboard)/levels/[entry]/page-selector.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";
import type { Guild } from "@/lib/guild.ts";
import { MAX_WINDOW_TITLE_LENGTH, TOKEN_COOKIE } from "@/utils/constants.ts";
import { guildIcon, type Snowflake } from "@/utils/discord-cdn.ts";
import { ellipsis } from "@/utils/ellipsis.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { type RoleReward, RoleRewardDisplay } from "./03-role-reward.tsx";
import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { MustLogIn, NotViewable } from "./leaderboard-errors.tsx";

if (!process.env.LEVELS_METADATA_KEY) {
	throw new Error("Missing LEVELS_METADATA_KEY environment variable");
}

export default async function Leaderboard({ params, searchParams }: LeaderboardProps) {
	const { page: rawPage } = await searchParams;
	const { entry } = await params;

	const page = parsePage(rawPage);

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const data = await getData(entry, token, page);

	if ("error" in data) {
		switch (data.error) {
			case GetLeaderboardError.MustBeLoggedIn:
				return <MustLogIn description="You must be logged in to view this leaderboard." statusCode={401} />;

			case GetLeaderboardError.MustBeAMemberOfGuild:
				return (
					<NotViewable description="You must be a member of this server to view this leaderboard." statusCode={403} />
				);

			default:
				return (
					<NotViewable
						description="This server does not exist or does not have the leveling system enabled"
						statusCode={404}
					/>
				);
		}
	}

	const {
		guild,
		isManager,
		vanity,
		levels,
		multipliers,
		roleRewards,
		xpGainInterval,
		xpPerMessageMax,
		xpPerMessageMin,
	} = data;

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
						fallback={fallbackAvatarImg}
						height={36}
						src={guildIcon(guild.id, guild.icon, { size: 64 })}
						unoptimized={Boolean(guild.icon)}
						width={36}
					/>

					<h1 className="font-bold text-2xl text-white md:text-3xl">{guild.name}</h1>
				</div>

				<p className="px-8 md:px-0">
					View the leveling leaderboard of {guild.name}, including rewards and multipliers!
				</p>
			</header>

			<main className="mx-auto mt-8 flex flex-col gap-12 lg:flex-row">
				<div className="w-full space-y-4 px-4 md:px-0">
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
					{roleRewards.length ? (
						<SidebarSection title="Role Rewards">
							<div className="flex flex-col gap-4">
								{roleRewards.map((roleReward) => (
									<RoleRewardDisplay key={roleReward.id} {...roleReward} />
								))}
							</div>
						</SidebarSection>
					) : null}

					{multipliers.length ? (
						<SidebarSection title="Multipliers">
							<div className="flex flex-col gap-4">
								{multipliers.map((multipliers) => (
									<MultiplierDisplay key={multipliers.id} {...multipliers} />
								))}
							</div>
						</SidebarSection>
					) : null}

					<SidebarSection title="How it works">
						<div className="space-y-2">
							<p>
								{xpPerMessageMin === xpPerMessageMax
									? `Every time you send a message you gain ${xpPerMessageMin} experience.`
									: `Every time you send a message you gain between ${xpPerMessageMin} and ${xpPerMessageMax} experience.`}
							</p>
							<p>
								To avoid spam, there is a cooldown of {prettyMilliseconds(xpGainInterval, { verbose: true })} per
								message sent.
							</p>
						</div>
					</SidebarSection>
				</div>
			</main>
		</div>
	);
}

export async function generateMetadata({ params, searchParams }: LeaderboardProps): Promise<Metadata> {
	const { entry } = await params;

	const defaultMetadata = {
		description: "View the leveling leaderboard of a Discord server, including rewards and multipliers!",
		title: "Leaderboard",
	};

	let response: Response;

	try {
		response = await makeApiRequest(`/levels/${entry}/metadata`, null, {
			headers: {
				"X-Internal-Key": process.env.LEVELS_METADATA_KEY!,
			},
			next: {
				revalidate: 6 * 60 * 60, // 6 hours
			},
		});

		if (!response.ok) {
			return defaultMetadata;
		}
	} catch {
		return defaultMetadata;
	}

	const guild = (await response.json()) as LevelsGuildMetadataResponse;

	const { page: rawPage } = await searchParams;
	const page = parsePage(rawPage);

	const previousUrl = page === 1 ? null : `/levels/${entry}?page=${page - 1}`;
	const nextUrl =
		page === LEADERBOARD_MAX_PAGE
			? null
			: guild.approximateLevelsCount > page * LEADERBOARD_ENTRIES_PER_PAGE
				? `/levels/${entry}?page=${page + 1}`
				: null;

	const titleSuffix = " • Leaderboard";

	return {
		description: `View the leveling leaderboard of ${guild.name}, including rewards and multipliers!`,

		pagination: {
			next: nextUrl,
			previous: previousUrl,
		},
		title: `${ellipsis(guild.name, MAX_WINDOW_TITLE_LENGTH - titleSuffix.length)}${titleSuffix}`,
	};
}

async function getData(entry: string, token: string | undefined, page: number) {
	try {
		const response = await makeApiRequest(`/levels/${entry}?page=${page}`, token, {
			next: {
				revalidate: 60,
				tags: [`levels:${entry}`],
			},
		});

		if (!response.ok) {
			return { error: GetLeaderboardError.Generic };
		}

		return response.json() as Promise<GetLevelsResponse>;
	} catch (error) {
		if (error instanceof Error && error.cause) {
			const response = error.cause as Response;

			if (response.status === 401) {
				return { error: GetLeaderboardError.MustBeLoggedIn };
			}

			if (response.status === 403) {
				return { error: GetLeaderboardError.MustBeAMemberOfGuild };
			}

			if (response.status === 404) {
				return { error: GetLeaderboardError.UnknownGuildOrDisabled };
			}
		}

		return { error: GetLeaderboardError.Generic };
	}
}

function parsePage(rawPage: string) {
	const page = Number.parseInt(rawPage, 10);

	if (Number.isNaN(page) || page < 1 || page > LEADERBOARD_MAX_PAGE) {
		return 1;
	}

	return page;
}

enum GetLeaderboardError {
	Generic = 0,
	MustBeLoggedIn = 1,
	MustBeAMemberOfGuild = 2,
	UnknownGuildOrDisabled = 3,
}

interface LevelsGuildMetadataResponse {
	readonly name: string;
	readonly approximateLevelsCount: number;
}

export interface GetLevelsResponse {
	guild: Omit<Guild, "channels" | "emojis" | "roles">;
	isManager: boolean;
	vanity: string | null;
	levels: Level[];
	multipliers: Multiplier[];
	roleRewards: RoleReward[];
	xpGainInterval: number;
	xpPerMessageMax: number;
	xpPerMessageMin: number;
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
