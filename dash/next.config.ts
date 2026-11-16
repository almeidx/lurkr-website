import type { NextConfig } from "next";
import { EXTERNAL_REDIRECTS } from "./src/external-redirects.ts";

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
		optimizePackageImports: [
			"@ariakit/react",
			"@gravity-ui/icons",
			"@heroui/react",
			"@heroui/styles",
			"@remixicon/react",
			"react-colorful",
		],
		turbopackRustReactCompiler: true,
	},
	async headers() {
		const isProduction = process.env.NODE_ENV === "production";
		const apiSrc = apiDomain ? `${process.env.NODE_ENV === "development" ? "http" : "https"}://${apiDomain}/` : "";
		const bucketSrc = backgroundBucketDomain ? `https://${backgroundBucketDomain}` : "";

		const csp = `
			default-src 'self';
			script-src 'self' 'unsafe-inline' ${isProduction ? "" : "'unsafe-eval'"} https://static.cloudflareinsights.com;
			style-src 'self' 'unsafe-inline';
			img-src 'self' https://cdn.discordapp.com ${bucketSrc} blob: data:;
			font-src 'self';
			object-src 'none';
			base-uri 'self';
			form-action 'self';
			connect-src 'self' ${apiSrc};
			frame-ancestors 'none';
			upgrade-insecure-requests;
		`;

		const permissionsPolicy = `
			accelerometer=(),
			camera=(),
			geolocation=(),
			gyroscope=(),
			magnetometer=(),
			microphone=(),
			payment=(),
			usb=()
		`;

		return [
			{
				headers: [
					{ key: "Content-Security-Policy", value: trimHeaderValue(csp) },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "Permissions-Policy", value: trimHeaderValue(permissionsPolicy) },
				],
				source: "/(.*)",
			},
		];
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
	reactCompiler: true,
	async redirects() {
		return [
			...EXTERNAL_REDIRECTS,
			// Docs pages that used to live at the root before moving under `/docs`.
			...[
				"/api",
				"/api/changelog",
				"/api/endpoints/:path*",
				"/changelog",
				"/config-commands/:path*",
				"/guides/:path*",
				"/leveling-commands/:path*",
				"/premium-perks",
				"/troubleshooting",
				"/utility-commands/:path*",
			].map((source) => ({ destination: `/docs${source}`, permanent: true, source })),
		];
	},
} as const satisfies NextConfig;

export default nextConfig;

function trimHeaderValue(value: string) {
	return value.replaceAll(/\t|^\s+|\s+$/g, "").replaceAll(/\n|\s{2,}/g, " ");
}
