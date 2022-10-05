/* eslint-disable react/iframe-missing-sandbox */

import Image from "next/future/image";
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
			<Link href="/invite">
				<a className="mt-1 mb-5 flex items-center justify-center gap-x-2 rounded-md bg-green-700 py-2 px-3 text-base text-white duration-150 hover:bg-green-600	md:mt-2 md:text-xl">
					<GiPartyPopper className="text-lg md:text-2xl" />
					<div className="flex flex-col items-center justify-center gap-x-1 md:flex-row">
						<p>Slash Commands update is live now!</p>
						<p>Try it out!</p>
					</div>
				</a>
			</Link>

			<Image alt="Pepe Manager avatar" height={64} src="/static/avatar.png" width={64} />

			<header className="flex flex-col items-center justify-center py-5">
				<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">Pepe Manager</h1>

				<p className="my-6 text-center text-lg font-light text-gray-400">
					A Discord bot with focus on automation, leveling, emoji management, and image manipulation
				</p>

				<div className="flex flex-row items-center justify-center gap-4">
					{buttons.map(({ path, text }, idx) => (
						<Link href={path} key={idx}>
							<a className="flex w-40 justify-center rounded-md bg-blurple py-2 px-3 text-white transition-colors duration-100 hover:bg-[#414AB9]">
								{text}
							</a>
						</Link>
					))}
				</div>
			</header>

			<div className="mt-3 flex flex-col items-center justify-center gap-4">
				<h2 className="font-display text-lg font-bold text-white sm:text-xl">
					Check out this Demonstration video by No Text To Speech
				</h2>

				<div className="relative block w-full pb-[56.25%]">
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute top-0 left-0"
						frameBorder={0}
						height="100%"
						sandbox="allow-scripts allow-same-origin"
						src="https://www.youtube.com/embed/uEHGNx3idFM"
						title="Free Mee6 Leveling Bot? | Pepe Manager"
						width="100%"
					/>
				</div>
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
