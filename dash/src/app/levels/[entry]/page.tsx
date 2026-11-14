import { buttonVariants } from "@heroui/styles";
import { isHTTPError } from "ky";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect, RedirectType } from "next/navigation";
import prettyMilliseconds from "pretty-ms";
import { cache } from "react";
import { LeaderboardTable } from "@/app/levels/[entry]/01-leaderboard-table.tsx";
import {
	LEADERBOARD_ENTRIES_PER_PAGE,
	LEADERBOARD_MAX_PAGE,
	leaderboardPath,
	PageSelector,
} from "@/app/levels/[entry]/page-selector.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ErrorState } from "@/components/error-state.tsx";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";
import { SignInButton } from "@/components/navigation/sign-in.tsx";
import { api } from "@/lib/api.ts";
import type { Guild } from "@/lib/guild.ts";
import { MAX_WINDOW_TITLE_LENGTH, NSFW_CONSENT_ACK, NSFW_CONSENT_COOKIE } from "@/utils/constants.ts";
import { getCookie } from "@/utils/cookies.ts";
import { guildIcon, type Snowflake } from "@/utils/discord-cdn.ts";
import { ellipsis } from "@/utils/ellipsis.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { RoleReward } from "./03-role-reward.tsx";
import type { Multiplier } from "./04-multiplier.tsx";
import { NsfwConsentGate } from "./nsfw-consent-gate.tsx";
import { SortableMultipliers } from "./sortable-multipliers.tsx";
import { SortableRoleRewards } from "./sortable-role-rewards.tsx";

enum GetLeaderboardError {
	MustBeLoggedIn = 1,
	MustBeAMemberOfGuild = 2,
	UnknownGuildOrDisabled = 3,
}

const getData = cache(async (entry: string, page: number) => {
	try {
		return await api
			.get(`levels/${entry}`, {
				cache: "no-store",
				searchParams: { page },
			})
			.json<GetLevelsResponse>();
	} catch (error) {
		if (isHTTPError(error)) {
			if (error.response.status === 401) {
				return { error: GetLeaderboardError.MustBeLoggedIn } as const;
			}

			if (error.response.status === 403) {
				return { error: GetLeaderboardError.MustBeAMemberOfGuild } as const;
			}

			if (error.response.status === 404) {
				return { error: GetLeaderboardError.UnknownGuildOrDisabled } as const;
			}
		}

		// Let the error boundary respond with a 5xx so crawlers retry instead of treating the page as gone.
		throw error;
	}
});

export default async function Leaderboard({ params, searchParams }: LeaderboardProps) {
	const [{ page: rawPage }, { entry }] = await Promise.all([searchParams, params]);

	const page = parsePage(rawPage);

	const data = await getData(entry, page);

	if ("error" in data) {
		switch (data.error) {
			case GetLeaderboardError.MustBeLoggedIn:
				return (
					<ErrorState
						description="You must be logged in to view this leaderboard."
						statusCode={401}
						title="Sign in required"
					>
						<SignInButton />
					</ErrorState>
				);

			case GetLeaderboardError.MustBeAMemberOfGuild:
				return (
					<ErrorState
						description="You must be a member of this server to view this leaderboard."
						statusCode={403}
						title="Access denied"
					>
						<Link className={buttonVariants({ variant: "primary" })} href="/levels">
							Back to leaderboards
						</Link>
					</ErrorState>
				);

			case GetLeaderboardError.UnknownGuildOrDisabled:
				notFound();
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
		redirect(leaderboardPath(vanity, page), RedirectType.replace);
	}

	if (guild.nsfw && (await getCookie(NSFW_CONSENT_COOKIE)) !== NSFW_CONSENT_ACK) {
		return <NsfwConsentGate guildName={guild.name} />;
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

					<h1 className="text-2xl font-bold text-white md:text-3xl">{guild.name}</h1>
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
							<p className="mb-4 text-center text-balance">
								There are no users in this page. Try going back to{" "}
								<Link className="text-blurple underline" href={leaderboardPath(vanity ?? guild.id, 1)}>
									page 1
								</Link>
								?
							</p>
						) : page > 1 ? (
							<p className="mb-4 text-center text-balance">There are no users in this page. Try going back</p>
						) : (
							<p className="mb-4 text-center">There are no users with experience yet</p>
						)
					) : null}

					<PageSelector amount={levels.length} entry={entry} page={page} />
				</div>

				<div className="flex w-full flex-col gap-5 px-4 sm:w-80 md:w-96 md:px-0">
					<SortableRoleRewards roleRewards={roleRewards} />

					<SortableMultipliers globalMultiplier={xpGlobalMultiplier} multipliers={multipliers} />

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
	const [{ entry }, { page: rawPage }] = await Promise.all([params, searchParams]);

	const page = parsePage(rawPage);
	const [data, guild] = await Promise.all([getData(entry, page), getLevelsMetadata(entry)]);

	const indexable = !("error" in data) && !data.guild.nsfw;
	const canonicalEntry = "error" in data ? entry : (data.vanity ?? entry);

	const defaultMetadata = {
		alternates: {
			canonical: leaderboardPath(canonicalEntry, page),
		},
		description: "View the leveling leaderboard of a Discord server, including rewards and multipliers!",
		robots: indexable ? undefined : { index: false },
		title: "Leaderboard",
	} satisfies Metadata;

	if (!guild) {
		return defaultMetadata;
	}

	const previousUrl = page === 1 ? null : leaderboardPath(canonicalEntry, page - 1);
	const nextUrl =
		page === LEADERBOARD_MAX_PAGE
			? null
			: guild.approximateLevelsCount > page * LEADERBOARD_ENTRIES_PER_PAGE
				? leaderboardPath(canonicalEntry, page + 1)
				: null;

	const titleSuffix = " • Leaderboard";

	return {
		...defaultMetadata,
		description: `View the leveling leaderboard of ${guild.name}, including rewards and multipliers!`,

		pagination: {
			next: nextUrl,
			previous: previousUrl,
		},
		title: `${ellipsis(guild.name, MAX_WINDOW_TITLE_LENGTH - titleSuffix.length)}${titleSuffix}`,
	};
}

async function getLevelsMetadata(entry: string) {
	if (!process.env.LEVELS_METADATA_KEY) {
		console.warn("Missing LEVELS_METADATA_KEY environment variable. Leaderboard metadata will not be available.");
		return null;
	}

	try {
		const response = await makeApiRequest(`/levels/${entry}/metadata`, null, {
			headers: {
				"X-Internal-Key": process.env.LEVELS_METADATA_KEY,
			},
			next: {
				revalidate: 6 * 60 * 60, // 6 hours
			},
		});

		return response.ok ? ((await response.json()) as LevelsGuildMetadataResponse) : null;
	} catch {
		return null;
	}
}

function parsePage(rawPage: string) {
	const page = Number.parseInt(rawPage, 10);

	if (Number.isNaN(page) || page < 1 || page > LEADERBOARD_MAX_PAGE) {
		return 1;
	}

	return page;
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
