import showcaseDarkImg from "@/assets/showcase-dark.png";
import showcaseLightImg from "@/assets/showcase-light.png";
import { ThemedImage } from "@/components/themed-image.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { MessageSquare, Star, Trophy, Zap } from "lucide-react";
import { FeatureExampleTabs } from "./feature-example-tabs.tsx";

const features = [
	{
		name: "Role Rewards",
		description:
			"Automatically reward active members with special roles as they level up and engage with your community.",
		icon: Trophy,
	},
	{
		name: "XP Multipliers",
		description: "Boost engagement with customizable multipliers for specific channels, events, or time periods.",
		icon: Star,
	},
	{
		name: "Active Channels",
		description: "Keep conversations flowing with dedicated channels for level-ups and community achievements.",
		icon: MessageSquare,
	},
	{
		name: "Engagement Boosters",
		description: "Special events and challenges that encourage members to participate and stay active.",
		icon: Zap,
	},
];

export function FeatureExamples() {
	return (
		<section aria-labelledby="feature-examples-title" className="mx-auto mt-28 w-full max-w-6xl px-3">
			<div className="flex flex-col">
				<Badge>Community Features</Badge>
				<h2
					id="feature-examples-title"
					className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
				>
					Engage & Reward <br /> Your Community
				</h2>
			</div>
			<p className="mt-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
				Give your members more reasons to stay active with an engaging leveling system, role rewards, and special events
				that make every message count.
			</p>
			<FeatureExampleTabs
				tab1={
					<ThemedImage
						alt="Example 1"
						lightSrc={showcaseLightImg}
						darkSrc={showcaseDarkImg}
						width={700}
						height={400}
						className="rounded-xl shadow-2xl dark:shadow-indigo-600/10"
					/>
				}
				tab2={
					<ThemedImage
						alt="Example 2"
						lightSrc={showcaseLightImg}
						darkSrc={showcaseDarkImg}
						width={700}
						height={400}
						className="rounded-xl shadow-2xl dark:shadow-indigo-600/10"
					/>
				}
			/>
			<dl className="mt-24 grid grid-cols-4 gap-10">
				{features.map((item) => (
					<div key={item.name} className="col-span-full sm:col-span-2 lg:col-span-1">
						<div className="w-fit rounded-lg p-2 shadow-indigo-400/30 shadow-md ring-1 ring-black/5 dark:shadow-indigo-600/30 dark:ring-white/5">
							<item.icon aria-hidden="true" className="size-6 text-indigo-600 dark:text-indigo-400" />
						</div>
						<dt className="mt-6 font-semibold text-gray-900 dark:text-gray-50">{item.name}</dt>
						<dd className="mt-2 text-gray-600 leading-7 dark:text-gray-400">{item.description}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
