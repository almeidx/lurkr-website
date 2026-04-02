/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { ErrorBoundary } from "@/components/error-boundary.tsx";
import { NotFound } from "@/components/not-found.tsx";
import { docsRoute } from "@/lib/shared.ts";
import appCss from "@/styles/app.css?url";
import { BRAND_COLOR, DESCRIPTION } from "@/utils/constants.ts";

export const Route = createRootRoute({
	component: RootComponent,
	errorComponent: ErrorBoundary,
	head: () => ({
		links: [
			{
				href: appCss,
				rel: "stylesheet",
			},
			{
				href: `${docsRoute}/apple-icon.png`,
				rel: "apple-touch-icon",
			},
			{
				href: `${docsRoute}/manifest.json`,
				rel: "manifest",
			},
			{
				href: `${docsRoute}/favicon.ico`,
				rel: "icon",
			},
			{
				href: `${docsRoute}/icon.png`,
				rel: "icon",
				sizes: "256x256",
				type: "image/png",
			},
		],
		meta: [
			{
				charSet: "utf-8",
			},
			{
				content: "width=device-width, initial-scale=1",
				name: "viewport",
			},
			{
				title: "Lurkr Docs",
			},
			{
				content: "Lurkr",
				name: "application-name",
			},
			{
				content: DESCRIPTION,
				name: "description",
			},
			{
				content: "yes",
				name: "mobile-web-app-capable",
			},
			{
				content: "Lurkr",
				name: "apple-mobile-web-app-title",
			},
			{
				content: BRAND_COLOR,
				name: "theme-color",
			},
			{
				content: BRAND_COLOR,
				name: "msapplication-TileColor",
			},
			{
				content: "/docs/static/mstile-icon-128.png",
				name: "msapplication-square70x70logo",
			},
			{
				content: "/docs/static/mstile-icon-270.png",
				name: "msapplication-square150x150logo",
			},
			{
				content: "/docs/static/mstile-icon-558.png",
				name: "msapplication-square310x310logo",
			},
			{
				content: "/docs/static/mstile-icon-558-270.png",
				name: "msapplication-wide310x150logo",
			},
			{
				content: "website",
				property: "og:type",
			},
			{
				content: "Lurkr",
				property: "og:site_name",
			},
			...(process.env.GOOGLE_SITE_VERIFICATION
				? [
						{
							content: process.env.GOOGLE_SITE_VERIFICATION,
							name: "google-site-verification",
						},
					]
				: []),
		],
	}),
	notFoundComponent: NotFound,
});

function RootComponent() {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-screen flex-col antialiased">
				<RootProvider
					search={{
						options: {
							api: `${docsRoute}/api/search`,
						},
					}}
					theme={{
						defaultTheme: "dark",
						forcedTheme: "dark",
					}}
				>
					<Outlet />
				</RootProvider>
				<Scripts />
			</body>
		</html>
	);
}
