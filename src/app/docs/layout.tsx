import "@/app/globals.css";
import "nextra-theme-docs/style.css";

import { openSans } from "@/app/fonts.ts";
import { Providers } from "@/app/providers.tsx";
import logoSmallImg from "@/assets/logo-small.webp";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Footer } from "@/components/Footer.tsx";
import { SvgGradients } from "@/components/svg-gradients.tsx";
import { GITHUB_REPOSITORY_URL } from "@/shared-links.js";
import { BRAND_COLOR, DOCS_URL, PUBLIC_URL } from "@/utils/constants.ts";
import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { PropsWithChildren } from "react";

export default async function RootLayout({ children }: PropsWithChildren) {
	const navbar = (
		<Navbar
			logo={
				<div className="flex items-center gap-2">
					<Image alt="Lurkr logo" className="size-[45px]" height={45} width={45} src={logoSmallImg.src} />
					<p className="font-medium text-xl no-underline">Lurkr</p>
				</div>
			}
		/>
	);

	const banner = (
		<Banner storageKey="alpha-documentation">
			Alpha documentation. To view the full documentation, go to{" "}
			<ExternalLink className="text-blurple" href={DOCS_URL}>
				{/* Remove the https:// prefix */}
				{DOCS_URL.slice(8)}
			</ExternalLink>
		</Banner>
	);

	const pageMap = await getPageMap("/docs");

	return (
		<html lang="en" suppressHydrationWarning>
			<Head
				backgroundColor={{ dark: "#171717", light: "#171717" }}
				color={{
					hue: 357.06,
					saturation: 100,
					lightness: 72,
				}}
			/>
			<body
				className={`${openSans.variable} scroll-smooth font-sans antialiased selection:bg-primary selection:text-white`}
			>
				<Providers>
					<Layout
						banner={banner}
						navbar={navbar}
						footer={<Footer />}
						editLink="Edit this page on GitHub"
						docsRepositoryBase={`${GITHUB_REPOSITORY_URL}/blob/main`}
						pageMap={pageMap}
						darkMode={false}
						nextThemes={{ defaultTheme: "dark" }}
					>
						{children}
					</Layout>
				</Providers>

				<SvgGradients />
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	metadataBase: PUBLIC_URL,

	title: {
		default: "Lurkr Documentation",
		template: "%s • Lurkr Documentation",
	},
	description: "Documentation for Lurkr, the ultimate no-paywall & featured leveling bot.",

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
