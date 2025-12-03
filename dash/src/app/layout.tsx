import "./globals.css";

import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { type PropsWithChildren, Suspense } from "react";
import { openSans } from "@/app/fonts.ts";
import { Providers } from "@/app/providers.tsx";
import { CookieNoticeHandler } from "@/components/CookieNoticeHandler.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Navbar } from "@/components/Navbar.tsx";
import { NavbarUserButton } from "@/components/NavbarUserButton.tsx";
import { PreviewWarning } from "@/components/PreviewWarning.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { SvgGradients } from "@/components/svg-gradients.tsx";
import { BRAND_COLOR, DESCRIPTION, PUBLIC_URL } from "@/utils/constants.ts";

const isPreview = process.env.ENVIRONMENT !== "prod" && process.env.NODE_ENV !== "development";

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className="dark" lang="en" style={{ colorScheme: "dark" }}>
			<body
				className={clsx(
					openSans.variable,
					"flex min-h-screen flex-col scroll-smooth bg-background font-sans text-white antialiased selection:bg-primary selection:text-white",
				)}
			>
				<Providers>
					<div className="flex-1">
						<Navbar>
							<Suspense fallback={<SignInButton />}>
								<NavbarUserButton />
							</Suspense>
						</Navbar>
						{children}
					</div>

					<Footer />

					<CookieNoticeHandler />
				</Providers>

				{isPreview && <PreviewWarning />}

				<SvgGradients />
			</body>
		</html>
	);
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
		default: "Lurkr • The ultimate Discord leveling bot",
		template: "%s • Lurkr",
	},

	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
	},
};

export const viewport: Viewport = {
	themeColor: BRAND_COLOR,
};
