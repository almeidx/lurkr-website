import "@/app/globals.css";

import { openSans } from "@/app/fonts.ts";
import { Providers } from "@/app/providers.tsx";
import { CookieNotice } from "@/components/CookieNotice.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Navbar } from "@/components/Navbar.tsx";
import { NavbarUserButton } from "@/components/NavbarUserButton.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { BRAND_COLOR, DESCRIPTION } from "@/utils/constants.ts";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { type PropsWithChildren, Suspense } from "react";
import { PreviewWarning } from "../components/PreviewWarning.tsx";

if (process.env.NODE_ENV === "production") {
	console.assert(process.env.NEXT_PUBLIC_GTM_ID, "NEXT_PUBLIC_GTM_ID environment variable is missing");
}

export default function RootLayout({ children }: PropsWithChildren) {
	const isPreview = process.env.ENVIRONMENT !== "prod" && process.env.NODE_ENV !== "development";

	return (
		<html lang="en">
			<body
				className={`${openSans.variable} flex min-h-screen flex-col scroll-smooth bg-background font-sans text-white antialiased selection:bg-primary selection:text-white`}
			>
				<Providers>
					<div className="flex-1">
						<Navbar>
							<Suspense fallback={<SignInButton />}>
								<NavbarUserButton />
							</Suspense>
						</Navbar>
						{children}
					</div>

					<Footer />

					{/* biome-ignore lint/complexity/noUselessFragments: The auto fix causes a syntax error */}
					<Suspense fallback={<></>}>
						<CookieNotice />
					</Suspense>
				</Providers>

				{isPreview && <PreviewWarning />}

				<svg className="absolute size-0" aria-hidden="true" focusable="false">
					<linearGradient
						id="icon-gradient-tertiary"
						x1="-4"
						y1="6"
						x2="16.8492"
						y2="-2.82183"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#d2ffae" />
						<stop offset="1" stopColor="#804994" />
					</linearGradient>
				</svg>

				<svg className="absolute size-0" aria-hidden="true" focusable="false">
					<linearGradient
						id="icon-gradient-primary"
						x1="5.00012"
						y1="30"
						x2="6.69388"
						y2="4.51736"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#ffe87c" />
						<stop offset="1" stopColor="#ff7077" />
					</linearGradient>
				</svg>

				<svg className="absolute size-0" aria-hidden="true" focusable="false">
					<defs>
						<linearGradient id="percentual-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#ffe87c" />
							<stop offset="100%" stopColor="#ff7077" />
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
		type: "website",
	},

	manifest: "/manifest.json",
	icons: { apple: "/apple-icon-180.png", icon: "icon.png" },
	appleWebApp: { title: "Lurkr", capable: true },
	applicationName: "Lurkr",
	other: {
		"msapplication-square70x70logo": "mstile-icon-128.png",
		"msapplication-square150x150logo": "mstile-icon-270.png",
		"msapplication-square310x310logo": "mstile-icon-558.png",
		"msapplication-wide310x150logo": "mstile-icon-558-270.png",
		"msapplication-TileColor": BRAND_COLOR,
	},
};

export const viewport: Viewport = {
	themeColor: BRAND_COLOR,
};
