import "tailwindcss/tailwind.css";
import "~/styles/global.css";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextProgress from "next-progress";
import { inProductionEnvironment } from "../utils/common";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import GuildProvider from "~/contexts/GuildContext";
import UserProvider from "~/contexts/UserContext";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<GuildProvider>
				<Head>
					<title>Pepe Manager</title>
				</Head>

				<NextProgress color="#2ecc71" />
				<Navbar />
				<Component {...pageProps} />
				<Footer />

				{inProductionEnvironment() ? <Analytics /> : null}
			</GuildProvider>
		</UserProvider>
	);
}
