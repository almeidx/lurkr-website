import type { NextConfig } from "next";
import { getNextConfigHeaders } from "../shared/common.ts";
import {
	BOT_INVITE,
	GITHUB_REPOSITORY_URL,
	PATREON_URL,
	SUPPORT_SERVER_INVITE,
	TOPGG_URL,
} from "./src/shared-links.ts";

if (!process.env.NEXT_PUBLIC_API_URL) {
	console.warn("NEXT_PUBLIC_API_URL environment variable is not set. API requests will fail.");
}

if (!process.env.BACKGROUNDS_BUCKET_DOMAIN) {
	console.warn("BACKGROUNDS_BUCKET_DOMAIN environment variable is not set. Backgrounds will not be visible.");
}

const apiDomain = process.env.NEXT_PUBLIC_API_URL?.split("://")[1] ?? "";
const backgroundBucketDomain = process.env.BACKGROUNDS_BUCKET_DOMAIN ?? "";

const nextConfig = {
	experimental: {
		reactCompiler: true,
		// ppr: true,
	},
	async headers() {
		return getNextConfigHeaders({
			extraConnectSrc: [`${apiDomain}/`],
			extraImgSrc: ["cdn.discordapp.com", backgroundBucketDomain],
		});
	},
	images: {
		qualities: [80, 100],
		remotePatterns: [
			{
				hostname: "cdn.discordapp.com",
				protocol: "https",
			},
			{
				hostname: backgroundBucketDomain,
				protocol: "https",
			},
		],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	async redirects() {
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
				destination: `${TOPGG_URL}&utm_campaign=redirect`,
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
	async rewrites() {
		const docsRewriteUrl = process.env.DOCS_REWRITE_URL;
		if (!docsRewriteUrl) {
			return [];
		}

		return {
			beforeFiles: [
				{
					destination: `${docsRewriteUrl}/docs`,
					source: "/docs",
				},
				{
					destination: `${docsRewriteUrl}/docs/:match*`,
					source: "/docs/:match*",
				},
			],
		};
	},
	typescript: {
		ignoreBuildErrors: true,
	},
} as const satisfies NextConfig;

export default nextConfig;
