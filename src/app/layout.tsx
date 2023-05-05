import "~/styles/global.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google/index";
import type { ReactNode } from "react";
import Navbar from "./navbar";
import { Providers } from "./providers";
import Footer from "~/components/Footer";

const openSans = Open_Sans({
	weight: ["300", "400", "500", "600", "700"],
	style: "normal",
	subsets: ["latin"],
	variable: "--font-open-sans",
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html className={`${openSans.variable} font-sans`} lang="en">
			<body className="scrollbar-thin scrollbar-track-discord-dark scrollbar-thumb-discord-lighter scrollbar-thumb-rounded-xl scroll-smooth">
				<Providers>
					<Navbar />

					{children}

					<Footer />
				</Providers>
			</body>
		</html>
	);
}

const DESCRIPTION =
	"The Ultimate No-Paywall & Featureful Leveling Bot. Powerful Utility and Automation for your Best Discord Server!";

export const metadata: Metadata = {
	title: "Lurkr",
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
	},
};
