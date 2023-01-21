import Image from "next/image";
import Link from "next/link";
import { GiPartyPopper } from "react-icons/gi";
import Showcase from "../components/Showcase";
import { showcases } from "../utils/constants";

interface ButtonData {
	path: string;
	text: string;
}

const buttons: ButtonData[] = [
	{
		path: "/invite",
		text: "Invite the bot",
	},
	{
		path: "/guilds",
		text: "Go to Dashboard",
	},
];

export default function Home() {
	return (
		<div className="flex flex-col items-center bg-discord-dark">
			<Link
				className="mt-1 mb-5 flex items-center justify-center gap-x-2 rounded-md bg-green-700 py-2 px-3 text-base text-white duration-150 hover:bg-green-600	md:mt-2 md:text-xl"
				href="/invite"
			>
				<GiPartyPopper className="text-lg md:text-2xl" />
				<div className="flex flex-col items-center justify-center gap-x-1 md:flex-row">
					<p>Slash Commands update is live now!</p>
					<p>Try it out!</p>
				</div>
			</Link>

			<Image alt="Pepe Manager avatar" height={64} src="/static/avatar.png" width={64} />

			<header className="flex flex-col items-center justify-center py-5">
				<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">Pepe Manager</h1>

				<p className="my-6 text-center text-lg font-light text-gray-400">
					A Discord bot with focus on automation, leveling, emoji management, and image manipulation
				</p>

				<div className="flex flex-row items-center justify-center gap-4">
					{buttons.map(({ path, text }, idx) => (
						<Link
							className="flex w-40 justify-center rounded-md bg-blurple py-2 px-3 text-white transition-colors duration-100 hover:bg-[#414AB9]"
							href={path}
							key={idx}
						>
							{text}
						</Link>
					))}
				</div>
			</header>

			<div className="mt-3 flex flex-col items-center justify-center gap-4">
				<h2 className="font-display text-lg font-bold text-white sm:text-xl">
					Check out this Demonstration video by No Text To Speech
				</h2>

				<a
					className="relative flex h-56 w-full items-center justify-center bg-black/20 bg-[url(/static/video.jpg)] bg-cover bg-blend-multiply md:h-80"
					href="https://www.youtube.com/watch?v=uEHGNx3idFM"
					rel="noreferrer"
					target="_blank"
				>
					<div className="absolute top-3 left-3 flex items-center gap-2">
						<Image
							alt="No Text To Speech YouTube channel icon"
							className="rounded-full"
							height={40}
							src="/static/no-text-to-speech.jpg"
							width={40}
						/>

						<span className="overflow-hidden text-ellipsis whitespace-nowrap text-lg text-white">
							Free Mee6 Leveling Bot? | Pepe Manager
						</span>
					</div>

					<Image
						alt="YouTube play button"
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
						height={72}
						src="/static/youtube-play.svg"
						width={72}
					/>

					<div className="absolute bottom-1 left-0 flex gap-2 bg-[#1a1a1d] p-4 text-sm font-semibold text-white">
						Watch on{" "}
						<Image
							alt="YouTube logo"
							className="fill-white text-white"
							height={16}
							src="/static/youtube-logo-with-text.svg"
							width={72}
						/>
					</div>
				</a>
			</div>

			<main className="my-12 flex max-w-screen-2xl flex-col items-center justify-center gap-12">
				{showcases.map(({ description, src, title }, idx) => (
					<Showcase
						align={idx % 2 === 0 ? "right" : "left"}
						description={description}
						key={idx}
						src={src}
						title={title}
					/>
				))}
			</main>
		</div>
	);
}
