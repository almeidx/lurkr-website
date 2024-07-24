import { type FeaturedGuild, FeaturedGuilds } from "@/app/featured-guilds.tsx";
import logoImg from "@/assets/logo.png";
import importImg from "@/assets/showcases/import.png";
import levelingImg from "@/assets/showcases/leveling.png";
import multipliersImg from "@/assets/showcases/multipliers.png";
import premiumImg from "@/assets/showcases/premium.png";
import rankCardsImg from "@/assets/showcases/rank-cards.png";
import roleRewardsImg from "@/assets/showcases/role-rewards.png";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Showcase } from "@/components/Showcase.tsx";
import { BOT_INVITE } from "@/shared-links.mjs";
import { formatNumber } from "@/utils/format-number.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { AttachMoney, Brush, CloudDownload, Launch, MilitaryTech, Speed, TrendingUp } from "@mui/icons-material";
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

			<div className="flex flex-col items-center gap-2 px-6 text-center [text-wrap:balance]">
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
			className="group w-72 rounded-lg bg-gradient-radial p-0.5 text-center font-bold text-3xl"
			href={BOT_INVITE}
		>
			<div className="size-full rounded-lg py-2 transition-colors group-hover:bg-background">
				<div className="flex h-full items-center justify-center text-center text-black transition-colors group-hover:bg-gradient-radial group-hover:bg-clip-text group-hover:text-transparent">
					Start Leveling
				</div>
			</div>
		</ExternalLink>
	);
}

function ShowcaseSeparator() {
	return <div className="my-4 h-6 w-[2px] bg-gradient-radial" />;
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
					guildCount: 24_000,
					messageCount: 400_000_000,
					memberCount: 10_000_000,
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
