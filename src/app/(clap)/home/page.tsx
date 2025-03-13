import { CallToAction } from "@/components/clap/call-to-action.tsx";
import { FeatureExamples } from "@/components/clap/feature-examples.tsx";
import { Features } from "@/components/clap/features.tsx";
import { GlobalStatistics } from "@/components/clap/global-statistics.tsx";
import { Hero } from "@/components/clap/hero.tsx";
import { ServerLogoCloud } from "@/components/clap/server-logo-cloud.tsx";

export default function Home() {
	return (
		<main className="flex flex-col overflow-hidden">
			<Hero />
			<ServerLogoCloud />
			<Features />
			<FeatureExamples />
			<GlobalStatistics />
			<CallToAction />
		</main>
	);
}
