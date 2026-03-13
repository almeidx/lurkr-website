import { Suspense } from "react";
import type { FeaturedGuild } from "@/app/featured-guilds.tsx";
import { WrappedNoticeContainer } from "@/components/wrapped-notice-container.tsx";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { CtaSection } from "./_homepage/cta.tsx";
import { FeaturedServersSection } from "./_homepage/featured-servers.tsx";
import { FeaturesSection } from "./_homepage/features.tsx";
import { HeroSection } from "./_homepage/hero.tsx";
import { NoPaywallSection } from "./_homepage/no-paywall.tsx";
import { StatsSection } from "./_homepage/stats.tsx";

export default async function Homepage() {
	const {
		stats: { guildCount, memberCount, messageCount, uptime },
		featured,
	} = await getData();

	return (
		<div className="flex flex-col overflow-x-hidden">
			<Suspense>
				<WrappedNoticeContainer />
			</Suspense>
			<HeroSection />
			<StatsSection guildCount={guildCount} memberCount={memberCount} messageCount={messageCount} uptime={uptime} />
			<FeaturesSection />
			<NoPaywallSection />
			{featured.length > 0 && <FeaturedServersSection featured={featured} />}
			<CtaSection guildCount={guildCount} />
		</div>
	);
}

// ─── data fetching ────────────────────────────────────────────────────────────
async function getData() {
	const [statsResponse, featuredResponse] = await Promise.allSettled([
		makeApiRequest("/stats", null, { next: { revalidate: 6 * 60 * 60 } }),
		makeApiRequest("/guilds/featured", null, { next: { revalidate: 60 * 60 } }),
	]);

	const stats =
		statsResponse.status === "fulfilled"
			? ((await statsResponse.value.json()) as StatsResponse)
			: { guildCount: 31_000, memberCount: 14_000_000, messageCount: 580_000_000, uptime: 99.9 };

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
