import logoImg from "@/assets/logo.png";
import importImg from "@/assets/showcases/import.png";
import levelingImg from "@/assets/showcases/leveling.png";
import multipliersImg from "@/assets/showcases/multipliers.png";
import premiumImg from "@/assets/showcases/premium.png";
import rankCardsImg from "@/assets/showcases/rank-cards.png";
import roleRewardsImg from "@/assets/showcases/role-rewards.png";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Showcase } from "@/components/Showcase";
import { formatNumber } from "@/utils/format-number.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { AttachMoney, Brush, CloudDownload, Launch, MilitaryTech, Speed, TrendingUp } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { BOT_INVITE } from "../../shared-links.mjs";

export default async function Homepage() {
	const { guildCount, memberCount, messageCount, uptime } = await getStats();

	return (
		<div className="flex flex-col items-center gap-10 mb-8 py-4">
			<div className="flex flex-col items-center gap-4 xl:gap-0">
				<div className="flex flex-col xl:flex-row gap-4 items-center xl:mr-20">
					<p className="text-3xl xl:text-4xl font-bold text-shadow-regular xl:whitespace-nowrap">
						Level Up your Server.
					</p>
					<Image
						alt="Lurkr logo"
						className="hidden xl:block aspect-square size-72"
						height={288}
						width={288}
						priority
						src={logoImg}
					/>
					<p className="text-3xl xl:text-4xl font-bold text-shadow-regular xl:whitespace-nowrap">Finally, for Free.</p>
				</div>

				<div className="flex gap-5">
					<StartLevelingButton />

					<Link
						className="hidden xl:flex w-72 items-center justify-center gap-5 rounded-lg border border-white px-3 py-2 text-3xl font-bold hover:bg-white hover:text-black transition-colors"
						href="/guilds"
					>
						Dashboard
						<Launch />
					</Link>
				</div>
			</div>

			<div className="border-t border-b border-white/50 w-full flex items-center justify-center">
				<div className="grid grid-cols-4 w-full px-8 py-2 xl:py-6 place-items-center max-w-xl xl:max-w-7xl">
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl xl:text-6xl text-shadow-regular">
							{formatNumber(guildCount, false)}
						</span>
						<p className="xl:place-self-end text-xs xl:text-base text-white/50">servers</p>
					</div>
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl xl:text-6xl text-shadow-regular">
							{formatNumber(memberCount, false)}
						</span>
						<p className="xl:place-self-end text-xs xl:text-base text-white/50">members</p>
					</div>
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl xl:text-6xl text-shadow-regular">{formatNumber(uptime)}%</span>
						<p className="xl:place-self-end text-xs xl:text-base text-white/50">uptime</p>
					</div>
					<div className="flex flex-col xl:flex-row xl:gap-5">
						<span className="font-extrabold text-2xl xl:text-6xl text-shadow-regular">
							{formatNumber(messageCount, false)}
						</span>
						<p className="xl:place-self-end text-xs xl:text-base text-white/50">messages</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center gap-2 px-6 text-center [text-wrap:balance]">
				<Showcase
					index={0}
					description="Seamlessly transition to Lurkr and never look back at unreasonable paywalls."
					imgSrc={importImg}
					title="Import & Never Lose Progress"
				>
					<CloudDownload className="text-[#60D1F6] size-9" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={1}
					description="Manage, Track & Reward your member's activity with deep and extensive configurations."
					imgSrc={levelingImg}
					title="Ultimate Leveling System"
				>
					<TrendingUp className="text-[#ff7077] size-9" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={2}
					description="Take complete control of your style & make sure that even your rank card expresses you."
					imgSrc={rankCardsImg}
					title="Customizable Rank Cards"
				>
					<Brush className="text-[#d2ffae] size-9" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={3}
					description="Incentivize activity with custom roles, permissions and other perks."
					imgSrc={roleRewardsImg}
					title="Endless Role Rewards"
				>
					<MilitaryTech className="text-[#ffe87c] size-9" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={4}
					description="Create global, channel & role multipliers to deeply customize leveling speed."
					imgSrc={multipliersImg}
					title="In-Depth Leveling Multipliers"
				>
					<Speed className="text-[#a475b5] size-9" />
				</Showcase>

				<ShowcaseSeparator />

				<Showcase
					index={5}
					description="We believe and focus in a fair premium model to unlock more configuration limits and not restrict standard features."
					imgSrc={premiumImg}
					title="Fair Pricing for All"
				>
					<AttachMoney className="text-[#b6fe94] size-9" />
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
			className="relative bg-gradient-radial w-72 z-[1] text-black text-center px-3 py-2 text-3xl font-bold rounded-lg before:absolute before:inset-0 before:bg-gradient-radial-hover before:z-[-1] before:transition-opacity before:duration-300 before:opacity-0 before:rounded-lg hover:before:opacity-100"
			href={BOT_INVITE}
		>
			Start Leveling
		</ExternalLink>
	);
}

async function getStats(): Promise<StatsResponse> {
	const response = await makeApiRequest("/stats", null, {
		next: {
			revalidate: 6 * 60 * 60, // 6 hours
		},
	}).catch(() => undefined);

	if (!response?.ok) {
		return {
			guildCount: 24_000,
			messageCount: 400_000_000,
			memberCount: 10_000_000,
			uptime: 99.9,
		};
	}

	return response.json();
}

interface StatsResponse {
	guildCount: number;
	memberCount: number;
	messageCount: number;
	uptime: number;
}

function ShowcaseSeparator() {
	return <div className="my-4 h-6 w-[2px] bg-gradient-radial" />;
}
