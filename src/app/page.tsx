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
import { Launch } from "@mui/icons-material";
import Link from "next/link";
import { BOT_INVITE } from "../../shared-links.mjs";

export default async function Homepage() {
	const { guildCount, memberCount, messageCount, uptime } = await getStats();

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col items-center gap-8 mt-12 mb-8 xl:mt-24 xl:mb-16">
				<div className="flex flex-col xl:flex-row gap-4 items-center">
					<p className="text-3xl xl:text-4xl font-bold text-shadow-regular xl:whitespace-nowrap">
						Level Up your Server.
					</p>
					<p className="text-3xl xl:text-4xl font-bold text-shadow-regular xl:whitespace-nowrap">Finally, for Free.</p>
				</div>

				<div className="flex gap-5">
					<StartLevelingButton />

					<Link
						className="hidden xl:flex w-72 items-center justify-center gap-5 rounded-lg border-2 border-white px-3 py-2 text-3xl font-bold hover:bg-white hover:text-black transition-colors duration-[50ms]"
						href="/guilds"
					>
						Dashboard
						<Launch />
					</Link>
				</div>
			</div>

			<div className="max-w-[720px] xl:max-w-[1280px] w-full flex gap-8 justify-between px-8 py-4 xl:py-6 text-center xl:text-left">
				<div className="flex flex-col xl:flex-row xl:gap-2">
					<span className="font-extrabold xl:font-bold text-2xl xl:text-[3.75rem] xl:leading-[3.75rem] text-shadow-regular">
						{formatNumber(guildCount, false)}
					</span>
					<p className="xl:place-self-end text-sm font-bold xl:font-normal tracking-wide xl:text-[1.25rem] xl:leading-[1.25rem] xl:mb-[0.275rem] text-white/55">
						servers
					</p>
				</div>

				<div className="flex flex-col xl:flex-row xl:gap-2">
					<span className="font-extrabold xl:font-bold text-2xl xl:text-[3.75rem] xl:leading-[3.75rem] text-shadow-regular">
						{formatNumber(memberCount, false)}
					</span>
					<p className="xl:place-self-end text-sm font-bold xl:font-normal tracking-wide xl:text-[1.25rem] xl:leading-[1.25rem] xl:mb-[0.275rem] text-white/55">
						users
					</p>
				</div>

				<div className="flex flex-col xl:flex-row xl:gap-2">
					<span className="font-extrabold xl:font-bold text-2xl xl:text-[3.75rem] xl:leading-[3.75rem] text-shadow-regular">
						{formatNumber(uptime)}%
					</span>
					<p className="xl:place-self-end text-sm font-bold xl:font-normal tracking-wide xl:text-[1.25rem] xl:leading-[1.25rem] xl:mb-[0.275rem] text-white/55">
						uptime
					</p>
				</div>

				<div className="flex flex-col xl:flex-row xl:gap-2">
					<span className="font-extrabold xl:font-bold text-2xl xl:text-[3.75rem] xl:leading-[3.75rem] text-shadow-regular">
						{formatNumber(messageCount, true)}
					</span>
					<p className="xl:place-self-end text-sm font-bold xl:font-normal tracking-wide xl:text-[1.25rem] xl:leading-[1.25rem] xl:mb-[0.275rem] text-white/55">
						messages
					</p>
				</div>
			</div>

			<div className="[text-wrap:balance] w-full">
				<Showcase
					index={0}
					description="Seamlessly transition to Lurkr and never look back at unreasonable paywalls."
					imgSrc={importImg}
					title="Import & Never Lose Progress"
				/>

				<Showcase
					index={1}
					description="Manage, Track & Reward your member's activity with deep and extensive configurations."
					imgSrc={levelingImg}
					title="Ultimate Leveling System"
				/>

				<Showcase
					index={2}
					description="Take complete control of your style & make sure that even your rank card expresses you."
					imgSrc={rankCardsImg}
					title="Customizable Rank Cards"
				/>

				<Showcase
					index={3}
					description="Incentivize activity with custom roles, permissions and other perks."
					imgSrc={roleRewardsImg}
					title="Endless Role Rewards"
				/>

				<Showcase
					index={4}
					description="Create global, channel & role multipliers to deeply customize leveling speed."
					imgSrc={multipliersImg}
					title="In-Depth Leveling Multipliers"
				/>

				<Showcase
					index={5}
					description="We believe and focus in a fair premium model to unlock more configuration limits and not restrict standard features."
					imgSrc={premiumImg}
					title="Fair Pricing for All"
				/>

				<div className="flex justify-center flex-col pb-12 xl:pb-24 items-center mx-auto">
					<StartLevelingButton />
				</div>
			</div>
		</div>
	);
}

function StartLevelingButton() {
	return (
		<ExternalLink href={BOT_INVITE}>
			<div className="bg-gradient-radial w-72 text-center p-0.5 text-3xl font-bold rounded-lg">
				<div className="hover:bg-background rounded-md transition-all duration-[50ms]">
					<div className="text-black hover:bg-gradient-radial hover:text-transparent hover:bg-clip-text py-2 transition-all duration-[50ms]">
						Start Leveling
					</div>
				</div>
			</div>
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
