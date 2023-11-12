import nextBundleAnalyzer from "@next/bundle-analyzer";
// import nextra from "nextra";
import { BOT_INVITE, GITHUB_REPOSITORY_URL, PATREON_URL, SUPPORT_SERVER_INVITE, TOPGG_URL } from "./shared-links.mjs";

const bundleAnalyzerEnabled = process.env.ANALYZE === "true";

// const withNextra = nextra({
// 	theme: "nextra-theme-docs",
// 	themeConfig: "./theme.config.jsx",
// });

/** @type {import("next").NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: "cdn.discordapp.com",
				protocol: "https",
			},
		],
	},
	experimental: {
		reactCompiler: true,
		ppr: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	redirects() {
		return [
			{
				destination: BOT_INVITE,
				permanent: false,
				source: "/invite",
			},
			{
				destination: PATREON_URL,
				permanent: false,
				source: "/patreon",
			},
			{
				destination: `${TOPGG_URL}?source=redirect`,
				permanent: true,
				source: "/vote",
			},
			{
				destination: GITHUB_REPOSITORY_URL,
				permanent: true,
				source: "/github",
			},
			{
				destination: SUPPORT_SERVER_INVITE,
				permanent: true,
				source: "/support",
			},
		];
	},
};

// export default withNextra(bundleAnalyzerEnabled ? nextBundleAnalyzer(nextConfig) : nextConfig);
export default bundleAnalyzerEnabled ? nextBundleAnalyzer(nextConfig) : nextConfig;
