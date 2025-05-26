import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import {
	BOT_INVITE,
	GITHUB_REPOSITORY_URL,
	PATREON_URL,
	SUPPORT_SERVER_INVITE,
	TOPGG_URL,
} from "./src/shared-links.js";

const apiDomain = process.env.NEXT_PUBLIC_API_URL!.split("://")[1];
const backgroundBucketDomain = process.env.BACKGROUNDS_BUCKET_DOMAIN!;

const cspHeader = `
	default-src 'self';
	script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"} static.cloudflareinsights.com;
	style-src 'self' 'unsafe-inline';
	img-src 'self' cdn.discordapp.com ${backgroundBucketDomain} blob: data:;
	font-src 'self';
	object-src 'none';
	base-uri 'self';
	form-action 'self';
	connect-src 'self' ${apiDomain}/;
	frame-ancestors 'none';
	upgrade-insecure-requests;
`;

const ppHeader = `
	accelerometer=(),
	camera=(),
	geolocation=(),
	gyroscope=(),
	magnetometer=(),
	microphone=(),
	payment=(),
	usb=()
`;

const nextConfig = {
	images: {
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
	experimental: {
		reactCompiler: true,
		// ppr: true,
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
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: cspHeader.replace(/\n/g, ""),
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: ppHeader.replace(/\n/g, ""),
					},
				],
			},
		];
	},
} as const satisfies NextConfig;

const withMDX = createMDX();

export default withMDX(nextConfig);
