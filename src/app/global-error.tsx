"use client";

import { openSans } from "@/app/fonts.ts";
import { BRAND_COLOR, DESCRIPTION } from "@/utils/constants.ts";
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
							<h1 className="text-9xl font-bold tracking-widest">500</h1>
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
	title: "Lurkr",
	description: DESCRIPTION,

	keywords: ["Lurkr", "Lurkr Bot", "Lurkr Invite", "Lurkr Discord", "Emoji Manager", "Emoji Manager Discord", "Lurker"],

	openGraph: {
		siteName: "Lurkr",
		title: "Lurkr",
		description: DESCRIPTION,
		type: "website",
	},
};

export const viewport: Viewport = {
	themeColor: BRAND_COLOR,
};
