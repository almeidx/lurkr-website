import { Suspense } from "react";
import type { FeaturedGuild } from "@/app/featured-guilds.tsx";
import { WrappedNoticeContainer } from "@/components/wrapped-notice-container.tsx";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { AmbientGlow } from "./_landing/ambient-glow.tsx";
import { FeatureChatPreview } from "./_landing/feature-chat-preview.tsx";
import { FeatureImport } from "./_landing/feature-import.tsx";
import { FeatureLeveling } from "./_landing/feature-leveling.tsx";
import { FeatureMultipliers } from "./_landing/feature-multipliers.tsx";
import { FeatureRankCard } from "./_landing/feature-rank-card.tsx";
import { FeatureRoleRewards } from "./_landing/feature-role-rewards.tsx";
import { FinalCTA } from "./_landing/final-cta.tsx";
import { Hero } from "./_landing/hero.tsx";
import { LogoWall } from "./_landing/logo-wall.tsx";
import { StatsStrip } from "./_landing/stats-strip.tsx";

export default async function Homepage() {
	const { stats, featured } = await getData();

	return (
		<div className="relative">
			<AmbientGlow />

			<div className="relative z-1 flex flex-col">
				<Suspense>
					<WrappedNoticeContainer />
				</Suspense>

				<Hero guildCount={stats.guildCount} />
				<StatsStrip
					guildCount={stats.guildCount}
					memberCount={stats.memberCount}
					messageCount={stats.messageCount}
					uptime={stats.uptime}
				/>
				<LogoWall featured={featured} />
				<FeatureLeveling />
				<FeatureRankCard />
				<FeatureRoleRewards />
				<FeatureMultipliers />
				<FeatureImport />
				<FeatureChatPreview />
				<FinalCTA />
			</div>
		</div>
	);
}

async function getData() {
	const [statsResponse, featuredResponse] = await Promise.allSettled([
		makeApiRequest("/stats", null, {
			next: {
				revalidate: 6 * 60 * 60, // 6 hours
			},
		}),
		makeApiRequest("/guilds/featured", null, {
			next: {
				revalidate: 60 * 60, // 1 hour
			},
		}),
	]);

	const stats =
		statsResponse.status === "fulfilled"
			? ((await statsResponse.value.json()) as StatsResponse)
			: {
					guildCount: 56_000,
					memberCount: 28_000_000,
					messageCount: 1_000_000_000,
					uptime: 99.9,
				};
	const featured =
		featuredResponse.status === "fulfilled" ? ((await featuredResponse.value.json()) as FeaturedGuild[]) : [];

	return { featured, stats };
}

interface StatsResponse {
	guildCount: number;
	memberCount: number;
	messageCount: number;
	uptime: number;
}
