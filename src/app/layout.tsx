import "@/app/globals.css";

import { openSans } from "@/app/fonts.ts";
import { Footer } from "@/components/Footer.tsx";
import { Navbar } from "@/components/Navbar.tsx";
import { BRAND_COLOR, DESCRIPTION } from "@/utils/constants.ts";
import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body
				className={`${openSans.variable} scroll-smooth bg-background font-sans text-white antialiased selection:bg-primary selection:text-white`}
			>
				<div className="flex flex-col">
					<div className="flex min-h-screen flex-col">
						<div className="flex-1">
							<Navbar />
							{children}
						</div>

						<Footer />
					</div>
				</div>

				<svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true" focusable="false">
					<linearGradient
						id="icon-gradient-tertiary"
						x1="-4"
						y1="6"
						x2="16.8492"
						y2="-2.82183"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#D2FFAE" />
						<stop offset="1" stopColor="#804994" />
					</linearGradient>
				</svg>

				<svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true" focusable="false">
					<linearGradient
						id="icon-gradient-primary"
						x1="5.00012"
						y1="30"
						x2="6.69388"
						y2="4.51736"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#FFE87C" />
						<stop offset="1" stopColor="#FF7077" />
					</linearGradient>
				</svg>
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: "Lurkr",
	description: DESCRIPTION,

	keywords: ["Lurkr", "Lurkr Bot", "Lurkr Invite", "Lurkr Discord", "Emoji Manager", "Emoji Manager Discord", "Lurker"],

	openGraph: {
		siteName: "Lurkr",
		title: "Lurkr",
		description: DESCRIPTION,
		type: "website",
	},
};

export const viewport: Viewport = {
	themeColor: BRAND_COLOR,
};
