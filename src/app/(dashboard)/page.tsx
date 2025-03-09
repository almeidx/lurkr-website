import { type FeaturedGuild, FeaturedGuilds } from "@/app/(dashboard)/featured-guilds.tsx";
import logoImg from "@/assets/logo.webp";
import importImg from "@/assets/showcases/import.webp";
import levelingImg from "@/assets/showcases/leveling.webp";
import multipliersImg from "@/assets/showcases/multipliers.webp";
import premiumImg from "@/assets/showcases/premium.webp";
import rankCardsImg from "@/assets/showcases/rank-cards.webp";
import roleRewardsImg from "@/assets/showcases/role-rewards.webp";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Showcase } from "@/components/Showcase.tsx";
import { AttachMoney } from "@/components/icons/mdi/attach-money.tsx";
import { Brush } from "@/components/icons/mdi/brush.tsx";
import { CloudDownload } from "@/components/icons/mdi/cloud-download.tsx";
import { Launch } from "@/components/icons/mdi/launch.tsx";
import { MilitaryTech } from "@/components/icons/mdi/military-tech.tsx";
import { Speed } from "@/components/icons/mdi/speed.tsx";
import { TrendingUp } from "@/components/icons/mdi/trending-up.tsx";
import { BOT_INVITE } from "@/shared-links.js";
import { formatNumber } from "@/utils/format-number.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import Image from "next/image";
import Link from "next/link";

export default async function Homepage() {
	const {
		stats: { guildCount, memberCount, messageCount, uptime },
		featured,
	} = await getData();

	const half = Math.ceil(featured.length / 2);
	const featured1 = featured.slice(0, half);
	const featured2 = featured.slice(half);

	return (
		<div className="mb-8 flex flex-col items-center gap-10 py-4">
			<div className="flex flex-col items-center gap-4 xl:gap-0">
				<div className="flex flex-col items-center gap-4 xl:mr-20 xl:flex-row">
					<p className="font-bold text-3xl text-shadow-regular xl:whitespace-nowrap xl:text-4xl">
						Level Up your Server.
					</p>
					<Image
						alt="Lurkr logo"
						className="hidden aspect-square size-72 xl:block"
						height={288}
						width={288}
						priority
						src={logoImg}
					/>
					<p className="font-bold text-3xl text-shadow-regular xl:whitespace-nowrap xl:text-4xl">Finally, for Free.</p>
				</div>

				<div className="flex gap-5">
					<StartLevelingButton />

					<Link
						className="hidden w-72 items-center justify-center gap-5 rounded-lg border border-white px-3 py-2 font-bold text-3xl transition-colors hover:bg-white hover:text-black xl:flex"
						href="/guilds"
					>
						Dashboard
						<Launch />
					</Link>
				</div>
			</div>

			<div className="flex w-full items-center justify-center border-white/50 border-t border-b">
				<div className="grid w-full max-w-xl grid-cols-4 place-items-center px-4 py-2 md:px-8 xl:max-w-7xl xl:py-6">
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl text-shadow-regular xl:text-6xl">
							{formatNumber(guildCount, false)}
						</span>
						<p className="text-white/50 text-xs xl:place-self-end xl:text-base">servers</p>
					</div>
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl text-shadow-regular xl:text-6xl">
							{formatNumber(memberCount, false)}
						</span>
						<p className="text-white/50 text-xs xl:place-self-end xl:text-base">members</p>
					</div>
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl text-shadow-regular xl:text-6xl">{formatNumber(uptime)}%</span>
						<p className="text-white/50 text-xs xl:place-self-end xl:text-base">uptime</p>
					</div>
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl text-shadow-regular xl:text-6xl">
							{formatNumber(messageCount, false)}
						</span>
						<p className="text-white/50 text-xs xl:place-self-end xl:text-base">messages</p>
					</div>
				</div>
			</div>

			{featured.length ? (
				<>
					<p className="mx-4 text-center font-bold text-3xl text-shadow-regular md:mx-0 xl:whitespace-nowrap xl:text-4xl">
						Trusted by Discord Servers <span className="italic">you</span> know!
					</p>

					<div className="container flex flex-col space-y-4">
						{featured.length > 8 ? (
							<>
								<FeaturedGuilds speed={40} guilds={featured1} />
								<FeaturedGuilds direction="right" speed={30} guilds={featured2} />
							</>
						) : (
							<FeaturedGuilds speed={40} guilds={featured} />
						)}
					</div>
				</>
			) : null}

			<div className="flex flex-col items-center gap-2 text-balance px-6 text-center">
				<Showcase
					index={0}
					description="Seamlessly transition to Lurkr and never look back at unreasonable paywalls."
					imgSrc={importImg}
					title="Import & Never Lose Progress"
				>
					<CloudDownload className="size-9 text-[#60d1f6]" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={1}
					description="Manage, Track & Reward your member's activity with deep and extensive configurations."
					imgSrc={levelingImg}
					title="Ultimate Leveling System"
				>
					<TrendingUp className="size-9 text-[#ff7077]" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={2}
					description="Take complete control of your style & make sure that even your rank card expresses you."
					imgSrc={rankCardsImg}
					title="Customizable Rank Cards"
				>
					<Brush className="size-9 text-[#d2ffae]" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={3}
					description="Incentivize activity with custom roles, permissions and other perks."
					imgSrc={roleRewardsImg}
					title="Endless Role Rewards"
				>
					<MilitaryTech className="size-9 text-[#ffe87c]" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={4}
					description="Create global, channel & role multipliers to deeply customize leveling speed."
					imgSrc={multipliersImg}
					title="In-Depth Leveling Multipliers"
				>
					<Speed className="size-9 text-[#a475b5]" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={5}
					description="We believe and focus in a fair premium model to unlock more configuration limits and not restrict standard features."
					imgSrc={premiumImg}
					title="Fair Pricing for All"
				>
					<AttachMoney className="size-9 text-[#b6fe94]" />
				</Showcase>

				<ShowcaseSeparator />

				<StartLevelingButton />
			</div>
		</div>
	);
}

function StartLevelingButton() {
	return (
		<ExternalLink
			className="group relative flex w-72 items-center justify-center rounded-lg p-px font-bold text-3xl"
			href={BOT_INVITE}
		>
			{/* Background gradient that becomes border on hover */}
			<div className="absolute inset-0 rounded-lg bg-linear-(--lurkr-gradient) transition-all group-hover:bg-clip-padding group-hover:p-px" />

			{/* Inner background that appears on hover */}
			<div className="relative flex w-full justify-center rounded-lg px-4 py-2 transition-colors group-hover:bg-background">
				{/* Text with background color by default, gradient on hover */}
				<span className="text-background transition-colors group-hover:bg-linear-(--lurkr-gradient) group-hover:bg-clip-text group-hover:text-transparent">
					Start Leveling
				</span>
			</div>
		</ExternalLink>
	);
}

function ShowcaseSeparator() {
	return <div className="my-4 h-6 w-0.5 bg-linear-(--lurkr-gradient)" />;
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
					guildCount: 31_000,
					messageCount: 580_000_000,
					memberCount: 14_000_000,
					uptime: 99.9,
				};
	const featured =
		featuredResponse.status === "fulfilled" ? ((await featuredResponse.value.json()) as FeaturedGuild[]) : [];

	return { stats, featured };
}

interface StatsResponse {
	guildCount: number;
	memberCount: number;
	messageCount: number;
	uptime: number;
}
