/* eslint-disable tsdoc/syntax */

/**
 * @type {import('next').NextConfig}
 */
export default {
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
		fallbackNodePolyfills: false,
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
				destination: "https://patreon.com/pepemanager",
				permanent: true,
				source: "/patreon",
			},
			{
				destination: "https://docs.pepemanager.com/",
				permanent: true,
				source: "/docs",
			},
			{
				destination: "https://www.youtube.com/playlist?list=PLeDA5I-uV0EcC1FDT6JufwxMjBun9iMx2",
				permanent: true,
				source: "/tutorials",
			},
			{
				destination: "https://github.com/almeidx/pepe-website",
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
