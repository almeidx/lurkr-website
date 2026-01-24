import { Card } from "@heroui/react";
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
		<div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
			{/* Hero Header */}
			<div className="relative overflow-hidden border-white/10 border-b bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
				<div className="container relative mx-auto px-4 py-12 md:px-6">
					<div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
						<div className="relative">
							<div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
							<ImageWithFallback
								alt={`${guild.name} guild icon`}
								className="relative size-24 rounded-full border-4 border-white/20 shadow-2xl"
								fallback={fallbackAvatarImg}
								height={96}
								src={guildIcon(guild.id, guild.icon, { size: 256 })}
								unoptimized={Boolean(guild.icon)}
								width={96}
							/>
						</div>
						<div className="space-y-2">
							<h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text font-bold text-4xl text-transparent md:text-5xl">
								{guild.name}
							</h1>
							<p className="text-lg text-white/60">
								Leveling Leaderboard • {levels.length > 0 ? `${levels.length} players` : "No players yet"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<main className="container mx-auto px-4 py-8 md:px-6">
				<div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
					{/* Main Leaderboard */}
					<div className="flex-1 space-y-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="font-semibold text-xl">Top Players</h2>
								<div className="text-sm text-white/50">
									Page {page} • {levels.length} {levels.length === 1 ? "player" : "players"}
								</div>
							</div>

							{levels.length === 0 ? (
								<Card className="border border-white/10 bg-white/5">
									<Card.Content className="px-6 py-8">
										{page > 2 ? (
											<p className="text-balance text-center text-white/80">
												There are no users in this page. Try going back to{" "}
												<Link
													className="font-semibold text-primary underline transition-colors hover:text-primary/80"
													href={`/levels/${vanity ?? guild.id}?page=1`}
												>
													page 1
												</Link>
												?
											</p>
										) : page > 1 ? (
											<p className="text-balance text-center text-white/80">
												There are no users in this page. Try going back
											</p>
										) : (
											<p className="text-center text-white/80">There are no users with experience yet</p>
										)}
									</Card.Content>
								</Card>
							) : (
								<div className="space-y-3">
									<LeaderboardTable data={levels} guildId={guild.id} isManager={isManager} />
								</div>
							)}
						</div>

						<PageSelector amount={levels.length} entry={entry} page={page} />
					</div>

					{/* Sidebar */}
					<aside className="flex w-full flex-col gap-4 lg:w-80">
						<SortableRoleRewards roleRewards={roleRewards} />

						<SortableMultipliers globalMultiplier={xpGlobalMultiplier} multipliers={multipliers} />

						<Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
							<Card.Header className="border-white/10 border-b px-5 py-4">
								<Card.Title className="flex items-center gap-2 font-semibold text-lg">
									<span className="text-2xl">💡</span>
									How it works
								</Card.Title>
							</Card.Header>
							<Card.Content className="px-5 py-4">
								<div className="space-y-4 text-sm text-white/70">
									<div className="flex items-start gap-3">
										<span className="mt-0.5 text-lg">✨</span>
										<p>
											{xpPerMessageMin === xpPerMessageMax
												? `Every message gives you ${xpPerMessageMin} experience.`
												: `Every message gives you ${xpPerMessageMin}-${xpPerMessageMax} experience.`}
										</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="mt-0.5 text-lg">⏱️</span>
										<p>Cooldown: {prettyMilliseconds(xpGainInterval, { verbose: true })} between messages</p>
									</div>
								</div>
							</Card.Content>
						</Card>
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
