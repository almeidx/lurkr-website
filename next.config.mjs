import nextBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = nextBundleAnalyzer({
	// eslint-disable-next-line no-undef
	enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
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
	experimental: {
		// fallbackNodePolyfills: false,
	},
	reactStrictMode: true,
	redirects() {
		return [
			{
				destination:
					"https://discord.com/oauth2/authorize?client_id=506186003816513538&scope=bot%20applications.commands&permissions=276220472384",
				permanent: true,
				source: "/invite",
			},
			{
				destination: "https://top.gg/bot/506186003816513538/vote",
				permanent: true,
				source: "/vote",
			},
			{
				destination: "https://patreon.com/lurkrbot",
				permanent: true,
				source: "/patreon",
			},
			{
				destination: "https://docs.lurkr.gg/",
				permanent: true,
				source: "/docs",
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
});
