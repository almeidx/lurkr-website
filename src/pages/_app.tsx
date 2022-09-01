import "tailwindcss/tailwind.css";
import "../styles/global.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import NavigationProgress from "nextjs-progressbar";
import { useEffect, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import type { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import GuildProvider from "../contexts/GuildContext";
import UserProvider from "../contexts/UserContext";
import environment from "../relay/environment";
import * as gtag from "../utils/gtag";
import { inProductionEnvironment } from "../utils/utils";

interface Props {
	records?: RecordMap;
}

export default function MyApp({ Component, pageProps, records: rec }: AppProps & Props) {
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

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const records: RecordMap = useMemo(() => {
		if (rec) {
			return rec;
		}

		if (typeof document !== "undefined") {
			const recordsData = document.querySelector("#relay-data")?.innerHTML;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			if (recordsData) {
				return JSON.parse(Buffer.from(recordsData, "base64").toString());
			}
		}

		return {};
	}, [rec]);

	return (
		<RelayEnvironmentProvider environment={environment(records)}>
			<UserProvider>
				<GuildProvider>
					<Head>
						<title>Pepe Manager</title>
					</Head>

					{inProductionEnvironment() && (
						<>
							{/* Global Site Tag (gtag.js) - Google Analytics */}
							<Script
								strategy="afterInteractive"
								src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
							/>
							<Script
								id="gtag-init"
								strategy="afterInteractive"
								dangerouslySetInnerHTML={{
									__html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gtag.GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
								}}
							/>
						</>
					)}

					<Navbar />
					<NavigationProgress color="#2ecc71" />
					<Component {...pageProps} />
					<Footer />
				</GuildProvider>
			</UserProvider>
		</RelayEnvironmentProvider>
	);
}
