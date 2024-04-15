import Image from "next/image";
import Link from "next/link";
import bannerImg from "~/assets/banner.png";
import lurkrBetaLogoPng from "~/assets/lurkr-beta-logo.png";
import promotionalVideoAuthorImg from "~/assets/promotional-video-author.jpg";
import promotionalVideoImg from "~/assets/promotional-video.png";
import customizableRankCardsImg from "~/assets/showcases/customizable-rank-cards.png";
import endlessRoleRewardsImg from "~/assets/showcases/endless-role-rewards.png";
import fairPricingForAllImg from "~/assets/showcases/fair-pricing-for-all.png";
import importExistingLevelsImg from "~/assets/showcases/import-existing-levels.png";
import inDepthLevelingMultipliersImg from "~/assets/showcases/in-depth-leveling-multipliers.png";
import ultimateLevelingSystemImg from "~/assets/showcases/ultimate-leveling-system.png";
import Showcase, { type ShowcaseProps } from "~/components/Showcase";
import { YouTubeLogoWithTextIcon } from "~/components/icons/YouTubeLogoWithText";
import { YouTubePlayIcon } from "~/components/icons/YouTubePlay";

const showcases = [
	{
		description:
			"Our bot allows you to track your users' activity and reward them! With our advanced level tracking system, you can easily see how active your users are and reward them accordingly. Whether you want to encourage engagement or simply show appreciation, our bot makes it easy to reward your community. Plus, our user-friendly dashboard lets you easily configure and customize your leveling system to fit your needs. Invite Lurkr today and start leveling up your Discord server!",
		src: ultimateLevelingSystemImg,
		title: "Ultimate Leveling System",
	},
	{
		description:
			"Bid farewell to restarting the grind and losing your hard-earned progress when switching bots. With Lurkr, seamlessly import your existing levels from other popular bots and continue your leveling journey without interruption. Keep your community engaged and motivated as you effortlessly integrate Lurkr into your Discord server. Upgrade to Lurkr today and enjoy a smooth, uninterrupted leveling adventure!",
		src: importExistingLevelsImg,
		title: "Import Existing Levels, No Restart Needed",
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
		<div className="flex flex-col items-center bg-discord-dark">
			<a
				className="mx-2 mt-1 flex items-center gap-2 text-balance rounded-lg bg-[#57dbbc] px-5 py-1.5 text-xl text-[#171717] hover:bg-[#46af96]"
				href="https://beta.lurkr.gg"
				rel="external noopener noreferrer"
			>
				<Image alt="Lurkr logo with Cyan colouring" src={lurkrBetaLogoPng} width={32} height={32} className="size-8" />
				Try out our new re-designed Website & Dashboard in Beta!
			</a>

			<header className="flex flex-col items-center justify-center py-5">
				<Image alt="Lurkr banner" className="animate-bounce-slow" height={150} priority src={bannerImg} width={300} />

				<p className="my-6 text-center text-lg font-light text-gray-400">
					A Discord bot with focus on automation, leveling, emoji management, and image manipulation
				</p>

				<div className="flex flex-row items-center justify-center gap-4">
					<a
						className="flex w-40 justify-center rounded-md bg-blurple px-3 py-2 text-white transition-colors hover:bg-[#414AB9]"
						href="https://discord.com/oauth2/authorize?client_id=506186003816513538&scope=bot%20applications.commands&permissions=276220472384"
						target="_blank"
						rel="external noopener noreferrer"
					>
						Invite the bot
					</a>

					<Link
						className="flex w-40 justify-center rounded-md bg-blurple px-3 py-2 text-white transition-colors hover:bg-[#414AB9]"
						href="/guilds"
					>
						Go to Dashboard
					</Link>
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

						<span className="truncate text-lg text-white">Skip MEE6 Leveling Premium!</span>
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
					<Showcase description={description} index={idx} key={idx} src={src} title={title} />
				))}
			</main>
		</div>
	);
}
