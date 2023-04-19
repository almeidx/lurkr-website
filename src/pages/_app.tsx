import "tailwindcss/tailwind.css";
import "~/styles/global.css";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import Head from "next/head";
import NextProgress from "next-progress";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import GuildProvider from "~/contexts/GuildContext";
import UserProvider from "~/contexts/UserContext";
import { inProductionEnvironment } from "~/utils/common";

const openSans = Open_Sans({
	weight: ["300", "400", "500", "600", "700"],
	style: "normal",
	subsets: ["latin"],
	variable: "--font-open-sans",
});

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<GuildProvider>
				<Head>
					<title>Lurkr</title>
				</Head>

				<NextProgress color="#ff7077" />

				<div className={`${openSans.variable} font-sans`}>
					<Navbar />
					<Component {...pageProps} />
					<Footer />
				</div>

				{inProductionEnvironment() ? <Analytics /> : null}
			</GuildProvider>
		</UserProvider>
	);
}
