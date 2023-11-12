import logoImg from "@/assets/logo.png";
import importImg from "@/assets/showcases/import.png";
import levelingImg from "@/assets/showcases/leveling.png";
import multipliersImg from "@/assets/showcases/multipliers.png";
import premiumImg from "@/assets/showcases/premium.png";
import rankCardsImg from "@/assets/showcases/rank-cards.png";
import roleRewardsImg from "@/assets/showcases/role-rewards.png";
import { Showcase } from "@/components/OldShowcase";
import { API_URL, BOT_INVITE } from "@/utils/constants.ts";
import { formatNumber } from "@/utils/format-number.ts";
import { BsAwardFill } from "@react-icons/all-files/bs/BsAwardFill";
import { FiTrendingUp } from "@react-icons/all-files/fi/FiTrendingUp";
import { HiOutlineExternalLink } from "@react-icons/all-files/hi/HiOutlineExternalLink";
import { IoMdBrush } from "@react-icons/all-files/io/IoMdBrush";
import { MdAttachMoney } from "@react-icons/all-files/md/MdAttachMoney";
import { MdCloudDownload } from "@react-icons/all-files/md/MdCloudDownload";
import { MdSpeed } from "@react-icons/all-files/md/MdSpeed";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
	const { guildCount, memberCount, messageCount, uptime } = await getStats();

	return (
		<div>
			<header className="flex flex-col items-center justify-center">
				<ul className="flex items-center justify-center gap-2 text-4xl font-semibold">
					<li>Leveling.</li>
					<li>Importing.</li>
					<li>Role Rewards.</li>
					<li>
						<Image alt="Lurkr logo" className="aspect-square" height={300} priority src={logoImg} />
					</li>
					<li>Multipliers.</li>
					<li>Boosting.</li>
					<li>Voting.</li>
					<li>XP.</li>
				</ul>

				<div className="flex gap-5">
					<a
						className="relative flex w-72 items-center justify-center bg-transparent px-3 py-2 text-3xl font-bold text-black before:absolute before:inset-1 before:rounded-lg before:bg-gradient-radial-blur before:blur-lg after:absolute after:inset-0 after:z-10 after:rounded-lg after:bg-gradient-radial"
						href={BOT_INVITE}
						rel="external noopener noreferrer"
						target="_blank"
					>
						<p className="z-20">Start Leveling</p>
					</a>

					<Link
						className="flex w-72 items-center justify-center gap-5 rounded-lg border border-white px-3 py-2 text-3xl font-bold"
						href="/guilds"
					>
						Dashboard
						<HiOutlineExternalLink />
					</Link>
				</div>
			</header>

			<main className="mb-24 flex flex-col items-center justify-center">
				<ul className="mt-20 flex w-full justify-center border-y-2 border-white/50 py-7">
					<li className="flex items-center justify-between gap-5 border-x-2 border-white/50 px-8">
						<span className="text-6xl font-extrabold">{formatNumber(guildCount, false)}</span>
						<p className="place-self-end font-light text-white/50">servers</p>
					</li>

					<li className="flex justify-between gap-5 px-8">
						<span className="text-6xl font-extrabold">{formatNumber(memberCount, false)}</span>
						<p className="place-self-end font-light text-white/50">members</p>
					</li>

					<li className="flex justify-between gap-5 border-x-2 border-white/50 px-8">
						<span className="text-6xl font-extrabold">{uptime}%</span>
						<p className="place-self-end font-light text-white/50">uptime</p>
					</li>

					<li className="flex justify-between gap-5 border-x-2 border-white/50 px-8">
						<span className="text-6xl font-extrabold">{formatNumber(messageCount, false)}</span>
						<p className="place-self-end font-light text-white/50">messages</p>
					</li>
				</ul>

				<div className="relative flex w-full flex-col items-center pt-12">
					<Showcase
						index={0}
						description="Seamlessly transition to Lurkr and never look back at unreasonable paywalls."
						imgSrc={importImg}
						title="Import & Never Loose Progress"
					>
						<MdCloudDownload color="#60D1F6" size={38} />
					</Showcase>

					<Showcase
						index={1}
						description="Manage, Track & Reward your member's activity with deep and extensive configurations."
						imgSrc={levelingImg}
						title="Ultimate Leveling System"
					>
						<FiTrendingUp color="#ff7077" size={38} />
					</Showcase>

					<Showcase
						index={2}
						description="Take complete control of your style & make sure that even your rank card expresses you."
						imgSrc={rankCardsImg}
						title="Customizable Rank Cards"
					>
						<IoMdBrush color="#d2ffae" size={38} />
					</Showcase>

					<Showcase
						index={3}
						description="Incentivize activity with custom roles, permissions and other perks."
						imgSrc={roleRewardsImg}
						title="Endless Role Rewards"
					>
						<BsAwardFill color="#ffe87c" size={38} />
					</Showcase>

					<Showcase
						index={4}
						description="Create global, channel & role multipliers to deeply customize leveling speed."
						imgSrc={multipliersImg}
						title="In-Depth Leveling Multipliers"
					>
						<MdSpeed color="#a475b5" size={38} />
					</Showcase>

					<Showcase
						index={5}
						isLast
						description="We believe and focus in a fair premium model to unlock more configuration limits and not restrict standard features."
						imgSrc={premiumImg}
						title="Fair Pricing for All"
					>
						<MdAttachMoney color="#b6fe94" size={38} />
					</Showcase>
				</div>
			</main>
		</div>
	);
}

async function getStats() {
	const response = await fetch(`${API_URL}/stats`, {
		next: {
			revalidate: 6 * 60 * 60, // 6 hours
		},
	}).catch(() => null);

	if (!response?.ok) {
		return {
			guildCount: 21_000,
			messageCount: 270_000_000,
			memberCount: 8_000_000,
			uptime: 99,
		} satisfies StatsResponse;
	}

	return response.json() as Promise<StatsResponse>;
}

interface StatsResponse {
	guildCount: number;
	memberCount: number;
	messageCount: number;
	uptime: number;
}
