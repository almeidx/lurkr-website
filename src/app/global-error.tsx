"use client";

import type { Metadata } from "next";
import { useEffect } from "react";
import { openSans } from "./fonts";
import Error from "~/components/Error";
import { DESCRIPTION } from "~/utils/constants";

export default function GlobalError({ error }: { error: Error }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html className={`${openSans.variable} font-sans`} lang="en">
			<body className="scrollbar-thin scrollbar-track-discord-dark scrollbar-thumb-discord-lighter scrollbar-thumb-rounded-xl scroll-smooth">
				<Error code={500} message="Internal Server Error." />
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: "Internal Server Error | Lurkr",
	description: DESCRIPTION,

	viewport: {
		minimumScale: 1,
		initialScale: 1,
		width: "device-width",
	},

	keywords: ["Lurkr", "Lurkr Bot", "Lurkr Invite", "Lurkr Discord", "Emoji Manager", "Emoji Manager Discord", "Lurker"],

	themeColor: "#ff7077",

	openGraph: {
		siteName: "Lurkr",
		title: "Lurkr",
		type: "website",
		description: DESCRIPTION,
		images: "https://lurkr.gg/banner.png",
	},
};
