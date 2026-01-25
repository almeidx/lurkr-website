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

	if (isSnowflake(entry) && vanity) {
		redirect(`/levels/${vanity}?page=${page}`, RedirectType.replace);
	}

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Atmospheric Background Layers */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
				<div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
				<div
					className="absolute inset-0 opacity-[0.015]"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			<main className="container relative mx-auto px-4 py-12 md:px-6">
				{/* Editorial-Style Header with Asymmetry */}
				<div className="mb-12">
					<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
						<div className="flex items-end gap-6">
							<div className="relative">
								<div className="absolute -inset-2 rounded-2xl bg-primary/20 blur-xl" />
								<ImageWithFallback
									alt={`${guild.name} guild icon`}
									className="relative size-20 shrink-0 rounded-2xl border-2 border-white/30 shadow-2xl"
									fallback={fallbackAvatarImg}
									height={80}
									src={guildIcon(guild.id, guild.icon, { size: 256 })}
									unoptimized={Boolean(guild.icon)}
									width={80}
								/>
							</div>
							<div className="pb-2">
								<h1 className="mb-2 font-black text-4xl tracking-tight md:text-5xl">{guild.name}</h1>
								<div className="flex items-baseline gap-3">
									<span className="font-bold text-lg text-white/40">LEADERBOARD</span>
									<span className="h-1 w-1 rounded-full bg-white/30" />
									<span className="font-medium text-sm text-white/50">
										{levels.length} {levels.length === 1 ? "player" : "players"}
									</span>
								</div>
							</div>
						</div>
						{levels.length > 0 && (
							<div className="md:pb-2">
								<PageSelector amount={levels.length} entry={entry} page={page} />
							</div>
						)}
					</div>
				</div>

				<div className="mx-auto flex max-w-[1400px] flex-col gap-12 lg:flex-row lg:items-start">
					{/* Main Leaderboard - Wider Layout */}
					<div className="flex-1 space-y-6">
						{levels.length === 0 ? (
							<div className="rounded-3xl border-2 border-white/10 bg-white/5 p-16 text-center backdrop-blur-sm">
								{page > 2 ? (
									<p className="text-balance text-lg text-white/70">
										No players on this page.{" "}
										<Link
											className="font-bold text-primary underline decoration-2 underline-offset-4 transition-colors hover:text-primary/80"
											href={`/levels/${vanity ?? guild.id}?page=1`}
										>
											Return to page 1
										</Link>
										?
									</p>
								) : page > 1 ? (
									<p className="text-lg text-white/70">No players on this page. Try going back.</p>
								) : (
									<p className="text-lg text-white/70">No players with experience yet.</p>
								)}
							</div>
						) : (
							<div className="space-y-3">
								<LeaderboardTable data={levels} guildId={guild.id} isManager={isManager} page={page} />
							</div>
						)}
					</div>

					{/* Sidebar - Sticky with Creative Layout */}
					<aside className="flex w-full flex-col gap-4 lg:sticky lg:top-8 lg:w-80">
						<SortableRoleRewards roleRewards={roleRewards} />
						<SortableMultipliers globalMultiplier={xpGlobalMultiplier} multipliers={multipliers} />
						<div className="relative overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/[0.02] p-6 backdrop-blur-sm">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.1),transparent_70%)]" />
							<div className="relative">
								<h3 className="mb-4 font-black text-sm text-white/50 uppercase tracking-[0.2em]">How It Works</h3>
								<div className="space-y-4">
									<div className="rounded-xl border border-white/10 bg-white/5 p-4">
										<div className="mb-1 font-bold text-white/40 text-xs uppercase tracking-wider">XP Per Message</div>
										<div className="font-black text-2xl">
											{xpPerMessageMin === xpPerMessageMax ? (
												<span>{xpPerMessageMin}</span>
											) : (
												<span>
													{xpPerMessageMin} → {xpPerMessageMax}
												</span>
											)}
										</div>
									</div>
									<div className="rounded-xl border border-white/10 bg-white/5 p-4">
										<div className="mb-1 font-bold text-white/40 text-xs uppercase tracking-wider">Cooldown</div>
										<div className="font-black text-2xl">{prettyMilliseconds(xpGainInterval, { verbose: true })}</div>
									</div>
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
