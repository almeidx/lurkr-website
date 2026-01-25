import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import prettyMilliseconds from "pretty-ms";
import { LeaderboardTable } from "@/app/levels/[entry]/01-leaderboard-table.tsx";
import {
	LEADERBOARD_ENTRIES_PER_PAGE,
	LEADERBOARD_MAX_PAGE,
	PageSelector,
} from "@/app/levels/[entry]/page-selector.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { Guild } from "@/lib/guild.ts";
import { MAX_WINDOW_TITLE_LENGTH, TOKEN_COOKIE } from "@/utils/constants.ts";
import { guildIcon, type Snowflake } from "@/utils/discord-cdn.ts";
import { ellipsis } from "@/utils/ellipsis.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { RoleReward } from "./03-role-reward.tsx";
import type { Multiplier } from "./04-multiplier.tsx";
import { MustLogIn, NotViewable } from "./leaderboard-errors.tsx";
import { SortableMultipliers } from "./sortable-multipliers.tsx";
import { SortableRoleRewards } from "./sortable-role-rewards.tsx";

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
		xpGlobalMultiplier,
		xpPerMessageMax,
		xpPerMessageMin,
	} = data;

	// Calculate server statistics
	const _totalXp = levels.reduce((sum, level) => sum + level.xp, 0);
	const _totalMessages = levels.reduce((sum, level) => sum + level.messageCount, 0);
	const _averageLevel = levels.length > 0 ? levels.reduce((sum, level) => sum + level.level, 0) / levels.length : 0;
	const _highestLevel = levels.length > 0 ? Math.max(...levels.map((level) => level.level)) : 0;

	if (isSnowflake(entry) && vanity) {
		redirect(`/levels/${vanity}?page=${page}`, RedirectType.replace);
	}

	return (
		<div className="min-h-screen">
			<main className="container mx-auto px-4 py-8 md:px-6">
				{/* Minimal Header */}
				<div className="mb-8 flex items-center justify-between border-white/10 border-b pb-6">
					<div className="flex items-center gap-4">
						<ImageWithFallback
							alt={`${guild.name} guild icon`}
							className="size-12 rounded-lg border border-white/20"
							fallback={fallbackAvatarImg}
							height={48}
							src={guildIcon(guild.id, guild.icon, { size: 128 })}
							unoptimized={Boolean(guild.icon)}
							width={48}
						/>
						<div>
							<h1 className="font-bold text-2xl">{guild.name}</h1>
							<p className="mt-0.5 text-white/50 text-xs">
								{levels.length} {levels.length === 1 ? "player" : "players"} • Page {page}
							</p>
						</div>
					</div>
					{levels.length > 0 && <PageSelector amount={levels.length} entry={entry} page={page} />}
				</div>

				<div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
					{/* Main Content */}
					<div className="flex-1 space-y-6">
						{/* Server Statistics */}
						{levels.length > 0 && (
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">Total XP</div>
									<div className="mt-1 font-bold">{formatNumber(totalXp)}</div>
								</div>
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">Total Messages</div>
									<div className="mt-1 font-bold">{formatNumber(totalMessages)}</div>
								</div>
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">Average Level</div>
									<div className="mt-1 font-bold">{averageLevel.toFixed(1)}</div>
								</div>
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">Highest Level</div>
									<div className="mt-1 font-bold">{highestLevel}</div>
								</div>
							</div>
						)}

						{levels.length === 0 ? (
							<div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center">
								{page > 2 ? (
									<p className="text-white/70">
										No players on this page.{" "}
										<Link
											className="font-semibold text-primary underline transition-colors hover:text-primary/80"
											href={`/levels/${vanity ?? guild.id}?page=1`}
										>
											Return to page 1
										</Link>
										?
									</p>
								) : page > 1 ? (
									<p className="text-white/70">No players on this page. Try going back.</p>
								) : (
									<p className="text-white/70">No players with experience yet.</p>
								)}
							</div>
						) : (
							<div className="space-y-2">
								<LeaderboardTable data={levels} guildId={guild.id} isManager={isManager} page={page} />
							</div>
						)}
					</div>

					{/* Sidebar */}
					<aside className="flex w-full flex-col gap-4 lg:w-72">
						<SortableRoleRewards roleRewards={roleRewards} />
						<SortableMultipliers globalMultiplier={xpGlobalMultiplier} multipliers={multipliers} />
						<div className="rounded-lg border border-white/10 bg-white/5 p-4">
							<h3 className="mb-3 font-semibold text-sm text-white/60 uppercase tracking-wider">How it works</h3>
							<div className="space-y-3 text-sm text-white/70">
								<div>
									<span className="font-medium text-white/90">XP per message:</span>{" "}
									{xpPerMessageMin === xpPerMessageMax ? (
										<span>{xpPerMessageMin}</span>
									) : (
										<span>
											{xpPerMessageMin}-{xpPerMessageMax}
										</span>
									)}
								</div>
								<div>
									<span className="font-medium text-white/90">Cooldown:</span>{" "}
									{prettyMilliseconds(xpGainInterval, { verbose: true })}
								</div>
							</div>
						</div>
					</aside>
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

	if (!process.env.LEVELS_METADATA_KEY) {
		console.warn("Missing LEVELS_METADATA_KEY environment variable. Leaderboard metadata will not be available.");
		return defaultMetadata;
	}

	let response: Response;

	try {
		response = await makeApiRequest(`/levels/${entry}/metadata`, null, {
			headers: {
				"X-Internal-Key": process.env.LEVELS_METADATA_KEY,
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
	xpGlobalMultiplier: number;
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
