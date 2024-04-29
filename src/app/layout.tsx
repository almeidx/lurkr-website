import "@/app/globals.css";

import { openSans } from "@/app/fonts.ts";
import { Providers } from "@/app/providers.tsx";
import { Footer } from "@/components/Footer.tsx";
import { NavbarContainer } from "@/components/NavbarContainer.tsx";
import { BRAND_COLOR, DESCRIPTION } from "@/utils/constants.ts";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";

if (process.env.NODE_ENV === "production") {
	console.assert(process.env.NEXT_PUBLIC_GTM_ID, "NEXT_PUBLIC_GTM_ID environment variable is missing");
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body
				className={`${openSans.variable} scroll-smooth bg-background font-sans text-white antialiased selection:bg-primary selection:text-white`}
			>
				<Providers>
					<div className="flex flex-col">
						<div className="flex min-h-screen flex-col">
							<div className="flex-1">
								<NavbarContainer />
								{children}
							</div>

							<Footer />
						</div>
					</div>
				</Providers>

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

				<svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true" focusable="false">
					<defs>
						<linearGradient id="percentual-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#FFE87C" />
							<stop offset="100%" stopColor="#FF7077" />
						</linearGradient>
					</defs>
				</svg>
			</body>

			{process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GTM_ID && (
				<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
			)}
		</html>
	);
}

export const metadata: Metadata = {
	title: {
		default: "Lurkr",
		template: "%s • Lurkr",
	},
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
