import Image from "next/image";
import Link from "next/link";
import bannerImg from "~/assets/banner.png";
import promotionalVideoAuthorImg from "~/assets/promotional-video-author.jpg";
import promotionalVideoImg from "~/assets/promotional-video.png";
import customizableRankCardsImg from "~/assets/showcases/customizable-rank-cards.png";
import endlessLevelRewardsImg from "~/assets/showcases/endless-level-rewards.png";
import flexibleLevelingRatesImg from "~/assets/showcases/flexible-leveling-rates.png";
import freeForeverLevelingImg from "~/assets/showcases/free-forever-leveling.png";
import uniqueLevelingFeaturesImg from "~/assets/showcases/unique-leveling-features.png";
import Showcase, { type ShowcaseProps } from "~/components/Showcase";
import { YouTubeLogoWithTextIcon } from "~/components/icons/YouTubeLogoWithText";
import { YouTubePlayIcon } from "~/components/icons/YouTubePlay";

const buttons = [
	{ path: "/invite", text: "Invite the bot" },
	{ path: "/guilds", text: "Go to Dashboard" },
] as const satisfies readonly ButtonData[];

const showcases = [
	{
		description:
			"We have created Lurkr after being outraged at finding out how much money certain bot developers/companies charge for basic features like role rewards or adjustable leveling rate, adding or removing levels, etc. We vow NEVER to lock leveling features behind a monthly paywall, so you can rest easy knowing that years down the line, you won't be asked to pay for a feature you've been using forever.",
		src: freeForeverLevelingImg,
		title: "Free Forever Leveling",
	},
	{
		description:
			"With the same principle as leveling features, customizing rank cards is free and very in-depth! You can change your progress bar colour dynamically based on roles or profile colours or just a solid colour and your background to any image you want to give your rank card the personality it deserves!",
		src: customizableRankCardsImg,
		title: "Customizable Rank Cards",
	},
	{
		description:
			"Reward your members for participating in chat! Everyone loves shiny new roles with flashy colours, and with Lurkr you can assign a near infinite amount of level rewards, from initiating roles at level 1 to grand master server champions all the way at level 100! ",
		src: endlessLevelRewardsImg,
		title: "Endless Level Rewards",
	},
	{
		description:
			"With our multiplier system you can dynamically and easily change the rate at which your members gain experience based on what channel they're in, what roles they have or don't have, or even change the rate of the whole server if our leveling is too fast for your liking!",
		src: flexibleLevelingRatesImg,
		title: "Flexible Leveling Rates",
	},
	{
		description:
			"Our team of Developers are constantly focused on developing new and interesting features for leveling, such as daily top leveling role, automatic level resets, ignored leveling bot prefixes, leveling in threads and so many more!",
		src: uniqueLevelingFeaturesImg,
		title: "Unique Leveling Features",
	},
] satisfies Omit<ShowcaseProps, "align" | "index">[];

export default function Home() {
	return (
		<div className="bg-discord-dark flex flex-col items-center">
			<header className="flex flex-col items-center justify-center py-5">
				<Image alt="Lurkr banner" className="animate-bounce-slow" height={150} priority src={bannerImg} width={300} />

				<p className="my-6 text-center text-lg font-light text-gray-400">
					A Discord bot with focus on automation, leveling, emoji management, and image manipulation
				</p>

				<div className="flex flex-row items-center justify-center gap-4">
					{buttons.map(({ path, text }, idx) => (
						<Link
							className="bg-blurple flex w-40 justify-center rounded-md px-3 py-2 text-white transition-colors hover:bg-[#414AB9]"
							href={path}
							key={idx}
						>
							{text}
						</Link>
					))}
				</div>
			</header>

			<div className="mt-3 flex flex-col items-center justify-center gap-4">
				<h2 className="text-lg font-bold text-white sm:text-xl">Check out this Demonstration video by CmdData</h2>

				<a
					className="relative flex aspect-video w-full items-center justify-center"
					href="https://www.youtube.com/watch?v=wB8HRdhsrm0"
				>
					<Image
						alt="Lurkr bot icon on top of MEE6 bot icon with the text 'FREE MEE6 PREMIUM?'"
						height={317}
						priority
						src={promotionalVideoImg}
						width={563}
					/>

					<div className="absolute left-3 top-3 flex items-center gap-2">
						<Image
							alt="CmdData YouTube channel icon"
							className="rounded-full"
							height={40}
							priority
							src={promotionalVideoAuthorImg}
							width={40}
						/>

						<span className="overflow-hidden text-ellipsis whitespace-nowrap text-lg text-white">
							Skip MEE6 Leveling Premium!
						</span>
					</div>

					<YouTubePlayIcon
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						height={51}
						width={72}
					/>

					<div className="absolute bottom-1 left-0 flex gap-2 bg-[#1a1a1d] p-4 text-sm font-semibold text-white">
						Watch on <YouTubeLogoWithTextIcon height={20} width={72} />
					</div>
				</a>
			</div>

			<main className="my-12 flex max-w-screen-2xl flex-col items-center justify-center gap-12">
				{showcases.map(({ description, src, title }, idx) => (
					<Showcase
						align={idx % 2 === 0 ? "right" : "left"}
						description={description}
						index={idx}
						key={idx}
						src={src}
						title={title}
					/>
				))}
			</main>
		</div>
	);
}

interface ButtonData {
	path: string;
	text: string;
}
