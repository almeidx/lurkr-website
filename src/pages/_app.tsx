import { openSans } from "@/app/fonts.ts";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main
			className={`${openSans.variable} scroll-smooth font-sans antialiased selection:bg-primary selection:text-white`}
		>
			<Component {...pageProps} />
		</main>
	);
}
