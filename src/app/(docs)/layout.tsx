import "./docs.css";

import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
// import { Footer } from "@/components/Footer.tsx";
import { BRAND_COLOR, DESCRIPTION, PUBLIC_URL } from "@/utils/constants.ts";
import { openSans } from "../fonts.ts";

export const runtime = "edge";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${openSans.variable} flex min-h-screen flex-col font-sans antialiased`}>
				<RootProvider
					theme={{
						defaultTheme: "dark",
						forcedTheme: "dark",
					}}
				>
					{children}
				</RootProvider>

				{/* <Footer /> */}
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	appleWebApp: {
		capable: true,
		title: "Lurkr",
	},

	applicationName: "Lurkr",
	description: DESCRIPTION,
	metadataBase: PUBLIC_URL,

	openGraph: {
		siteName: "Lurkr",
		type: "website",
	},

	other: {
		"msapplication-square70x70logo": "/static/mstile-icon-128.png",
		"msapplication-square150x150logo": "/static/mstile-icon-270.png",
		"msapplication-square310x310logo": "/static/mstile-icon-558.png",
		"msapplication-TileColor": BRAND_COLOR,
		"msapplication-wide310x150logo": "/static/mstile-icon-558-270.png",
	},

	title: {
		default: "Lurkr Docs",
		template: "%s • Lurkr Docs",
	},

	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
	},
};

export const viewport: Viewport = {
	themeColor: BRAND_COLOR,
};
