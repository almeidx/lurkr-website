import "tailwindcss/tailwind.css";
import "~/styles/global.css";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextProgress from "next-progress";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import GuildProvider from "~/contexts/GuildContext";
import UserProvider from "~/contexts/UserContext";
import { inProductionEnvironment } from "~/utils/common";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<GuildProvider>
				<Head>
					<title>Lurkr</title>
				</Head>

				<NextProgress color="#ff7077" />
				<Navbar />
				<Component {...pageProps} />
				<Footer />

				{inProductionEnvironment() ? <Analytics /> : null}
			</GuildProvider>
		</UserProvider>
	);
}
