import "~/styles/global.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { openSans } from "./fonts";
import Navbar from "./navbar";
import { Providers } from "./providers";
import Footer from "~/components/Footer";
import { DESCRIPTION } from "~/utils/constants";

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
