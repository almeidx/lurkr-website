import nextBundleAnalyzer from "@next/bundle-analyzer";

// eslint-disable-next-line no-undef
const bundleAnalyzerEnabled = process.env.ANALYZE === "true";

/** @type {import("next").NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "cdn.discordapp.com",
				protocol: "https",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	reactStrictMode: true,
	redirects() {
		return [
			{
				destination:
					"https://discord.com/oauth2/authorize?client_id=506186003816513538&scope=bot%20applications.commands&permissions=276220472384",
				permanent: false,
				source: "/invite",
			},
			{
				destination: "https://top.gg/bot/506186003816513538/vote",
				permanent: false,
				source: "/vote",
			},
			{
				destination: "https://patreon.com/lurkrbot",
				permanent: false,
				source: "/patreon",
			},
			{
				destination: "https://github.com/almeidx/lurkr-website",
				permanent: true,
				source: "/github",
			},
			{
				destination: "https://discord.gg/XUQAnkq2vy",
				permanent: true,
				source: "/support",
			},
		];
	},
};

export default bundleAnalyzerEnabled ? nextBundleAnalyzer(nextConfig) : nextConfig;
