import "tailwindcss/tailwind.css";
import "~/styles/global.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import NextProgress from "next-progress";
import { useEffect } from "react";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import GuildProvider from "~/contexts/GuildContext";
import UserProvider from "~/contexts/UserContext";
import { inProductionEnvironment } from "~/utils/common";
import * as gtag from "~/utils/gtag";

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			if (inProductionEnvironment()) {
				gtag.pageView(url);
			}
		};

		router.events.on("routeChangeComplete", handleRouteChange);

		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	return (
		<UserProvider>
			<GuildProvider>
				<Head>
					<title>Pepe Manager</title>
				</Head>

				{inProductionEnvironment() && (
					<>
						{/* Global Site Tag (gtag.js) - Google Analytics */}
						<Script
							src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
							strategy="afterInteractive"
						/>
						<Script
							dangerouslySetInnerHTML={{
								__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date);gtag('config','${gtag.GA_TRACKING_ID}',{page_path:window.location.pathname});`,
							}}
							id="gtag-init"
							strategy="afterInteractive"
						/>
					</>
				)}

				<Navbar />
				<NextProgress color="#2ecc71" />
				<Component {...pageProps} />
				<Footer />
			</GuildProvider>
		</UserProvider>
	);
}
