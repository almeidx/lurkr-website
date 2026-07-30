import "./globals.css";

import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { type PropsWithChildren, Suspense } from "react";
import { openSans } from "@/app/fonts.ts";
import { Providers } from "@/app/providers.tsx";
import { CookieNoticeHandler } from "@/components/cookie-notice-handler.tsx";
import { Footer } from "@/components/navigation/footer.tsx";
import { Navbar } from "@/components/navigation/navbar.tsx";
import { NavbarUserButton } from "@/components/navigation/navbar-user-button.tsx";
import { SignInButton } from "@/components/navigation/sign-in.tsx";
import { PreviewWarning } from "@/components/preview-warning.tsx";
import { SvgGradients } from "@/components/svg-gradients.tsx";
import { BRAND_COLOR, DESCRIPTION, PUBLIC_URL } from "@/utils/constants.ts";

const isPreview = process.env.NEXT_PUBLIC_ENVIRONMENT !== "prod" && process.env.NODE_ENV !== "development";

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
					{isPreview && <PreviewWarning />}
					<div className="flex flex-1 flex-col">
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
