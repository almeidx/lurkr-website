import "./globals.css";

import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { source } from "@/lib/source.ts";
// import { Footer } from "@/components/Footer.tsx";
import { BRAND_COLOR, DESCRIPTION, PUBLIC_URL } from "@/utils/constants.ts";
import { baseOptions } from "../lib/layout.shared.tsx";
import { openSans } from "./fonts.ts";

export const dynamic = "force-static";
export const revalidate = 10800; // 3 hours

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${openSans.variable} flex min-h-screen flex-col font-sans antialiased`}>
				<RootProvider
					search={{
						options: {
							api: "/docs/api/search",
						},
					}}
					theme={{
						defaultTheme: "dark",
						forcedTheme: "dark",
					}}
				>
					<DocsLayout tree={source.pageTree} {...baseOptions()}>
						{children}
					</DocsLayout>
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
