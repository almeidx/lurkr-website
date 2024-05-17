import { openSans } from "@/app/fonts.ts";
import { GoogleTagManager } from "@next/third-parties/google";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main
			className={`${openSans.variable} scroll-smooth font-sans antialiased selection:bg-primary selection:text-white`}
		>
			<Component {...pageProps} />

			{process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GTM_ID && (
				<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
			)}
		</main>
	);
}
