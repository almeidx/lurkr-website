"use client";

import "@/app/globals.css";

import { openSans } from "@/app/fonts.ts";
import { BRAND_COLOR, DESCRIPTION, PUBLIC_URL } from "@/utils/constants.ts";
import type { Metadata, Viewport } from "next";

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	console.error(error);

	return (
		<html lang="en">
			<body
				className={`${openSans.variable} scroll-smooth bg-background font-sans text-white antialiased selection:bg-primary selection:text-white`}
			>
				<div className="flex flex-col">
					<div className="min-h-[calc(100vh-6.9rem)]">
						<div className="mt-16 flex flex-col items-center gap-12">
							<h1 className="font-bold text-9xl tracking-widest">500</h1>
							<p className="text-center">
								Whoops… An error occurred.{" "}
								<button onClick={reset} type="button">
									Try again
								</button>
							</p>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}

interface GlobalErrorProps {
	readonly error: Error;
	reset(): void;
}

export const metadata: Metadata = {
	metadataBase: PUBLIC_URL,

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
