"use client";

import "@/app/globals.css";

import { Button } from "@heroui/react";
import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { openSans } from "@/app/fonts.ts";
import { ErrorState } from "@/components/error-state.tsx";
import { BRAND_COLOR, DESCRIPTION, PUBLIC_URL } from "@/utils/constants.ts";

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	console.error(error);

	return (
		<html lang="en">
			<body
				className={clsx(
					openSans.variable,
					"flex min-h-screen flex-col scroll-smooth bg-background font-sans text-white antialiased selection:bg-primary selection:text-white",
				)}
			>
				<ErrorState description="An unexpected error occurred." statusCode={500} title="Something went wrong">
					<Button onPress={reset} variant="primary">
						Try again
					</Button>
				</ErrorState>
			</body>
		</html>
	);
}

interface GlobalErrorProps {
	readonly error: Error;
	reset(): void;
}

export const metadata: Metadata = {
	appleWebApp: {
		capable: true,
		title: "Lurkr",
	},

	applicationName: "Lurkr",
	description: DESCRIPTION,
	metadataBase: PUBLIC_URL,

	openGraph: {
		siteName: "Lurkr",
		type: "website",
	},

	other: {
		"msapplication-square70x70logo": "/static/mstile-icon-128.png",
		"msapplication-square150x150logo": "/static/mstile-icon-270.png",
		"msapplication-square310x310logo": "/static/mstile-icon-558.png",
		"msapplication-TileColor": BRAND_COLOR,
		"msapplication-wide310x150logo": "/static/mstile-icon-558-270.png",
	},

	title: {
		default: "Lurkr",
		template: "%s • Lurkr",
	},

	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
	},
};

export const viewport: Viewport = {
	themeColor: BRAND_COLOR,
};
