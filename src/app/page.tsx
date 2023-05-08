import Image from "next/image";
import Link from "next/link";
import bannerImg from "~/assets/banner.png";
import promotionalVideoAuthorImg from "~/assets/promotional-video-author.jpg";
import promotionalVideoImg from "~/assets/promotional-video.png";
import customizableRankCardsImg from "~/assets/showcases/customizable-rank-cards.png";
import endlessRoleRewardsImg from "~/assets/showcases/endless-role-rewards.png";
import fairPricingForAllImg from "~/assets/showcases/fair-pricing-for-all.png";
import inDepthLevelingMultipliersImg from "~/assets/showcases/in-depth-leveling-multipliers.png";
import ultimateLevelingSystemImg from "~/assets/showcases/ultimate-leveling-system.png";
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
			"Our bot allows you to track your users' activity and reward them! With our advanced level tracking system, you can easily see how active your users are and reward them accordingly. Whether you want to encourage engagement or simply show appreciation, our bot makes it easy to reward your community. Plus, our user-friendly dashboard lets you easily configure and customize your leveling system to fit your needs. Invite Lurkr today and start leveling up your Discord server!",
		src: ultimateLevelingSystemImg,
		title: "Ultimate Leveling System",
	},
	{
		description:
			"Introducing all-new Discord rank card customization! With Lurkr, you have complete control over your rank card design. Using our easy-to-use slash commands, you can change your background and progress bar colour in just a few seconds. Choose from a wide variety of colours to make your rank card stand out and represent your style. Our bot allows you to fully customize your rank card, so it's never been easier to create a unique and personalized rank card that truly represents you. Invite Lurkr to your server and start customizing your rank card like a pro!",
		src: customizableRankCardsImg,
		title: "Customizable Rank Cards",
	},
	{
		description:
			"With our advanced reward system, you can incentivize activity and engagement in your community by granting custom roles, permissions, and other perks to your users as they progress. Lurkr allows you to set up your own custom reward and permission systems in just a few clicks. And unlike other solutions, Lurkr does not have unreasonable restrictions on role rewards, or has them premium-locked completely! Invite Lurkr today and start rewarding your users like a pro!",
		src: endlessRoleRewardsImg,
		title: "Endless Role Rewards",
	},
	{
		description:
			"Lurkr allows you to create global, channel, and role multipliers to deeply customize and adjust your leveling system for specific situations. Our advanced multiplier system lets you reward users differently based on the channels they're active in, the roles they have, or the global multiplier you set. Plus, our user-friendly dashboard makes it easy to set up and configure your custom multiplier system.",
		src: inDepthLevelingMultipliersImg,
		title: "In-Depth Leveling Multipliers",
	},
	{
		description:
			"At Lurkr, we believe in a fair and equitable Discord leveling bot for all. That's why we never restrict single features behind paywalls, and instead focus on a fair premium model. With Lurkr, you can enjoy a robust set of features and customization options without ever feeling like you're missing out. Our premium model simply allows you to unlock additional configuration limits and support our development team. Plus, our documentation and Patreon page makes it easy to see which limits are free and which ones require premium access. Join our community today and experience a Discord leveling bot that puts fairness and accessibility first.",
		src: fairPricingForAllImg,
		title: "Fair Pricing for All",
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
