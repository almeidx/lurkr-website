import "@/css/globals.css";

import { Footer } from "@/components/clap/footer.tsx";
import { Navigation } from "@/components/clap/navbar";
import { BASE_URL, BRAND_COLOR } from "@/utils/constants.ts";
import { DESCRIPTION } from "@/utils/constants.ts";
import type { Viewport } from "next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { openSans } from "../fonts";

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${openSans.className} min-h-screen scroll-auto bg-white antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
			>
				<ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
					<Navigation />
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),

	title: {
		default: "Lurkr",
		template: "%s • Lurkr",
	},
	description: DESCRIPTION,

	appleWebApp: {
		title: "Lurkr",
		capable: true,
	},

	applicationName: "Lurkr",

	openGraph: {
		siteName: "Lurkr",
		type: "website",
	},

	other: {
		"msapplication-square70x70logo": "/static/mstile-icon-128.png",
		"msapplication-square150x150logo": "/static/mstile-icon-270.png",
		"msapplication-square310x310logo": "/static/mstile-icon-558.png",
		"msapplication-wide310x150logo": "/static/mstile-icon-558-270.png",
		"msapplication-TileColor": BRAND_COLOR,
	},
};

export const viewport: Viewport = {
	themeColor: BRAND_COLOR,
};
