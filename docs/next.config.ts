import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { getNextConfigHeaders } from "../shared/common.ts";

const nextConfig = {
	basePath: "/docs",
	// cacheComponents: true,
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
	async headers() {
		return getNextConfigHeaders();
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	reactCompiler: true,
	async redirects() {
		return [
			{
				destination: "/config-commands/config",
				permanent: true,
				source: "/config-commands",
			},
			{
				destination: "/utility-commands/emoji/create",
				permanent: true,
				source: "/utility-commands/emoji/create-emoji",
			},
			{
				destination: "/utility-commands/emoji/delete",
				permanent: true,
				source: "/utility-commands/emoji/delete-emoji",
			},
			{
				destination: "/utility-commands/emoji/download",
				permanent: true,
				source: "/utility-commands/emoji/download-emoji",
			},
			{
				destination: "/utility-commands/emoji/random",
				permanent: true,
				source: "/utility-commands/emoji/random-emoji",
			},
			{
				destination: "/utility-commands/emoji/search",
				permanent: true,
				source: "/utility-commands/emoji/search-emoji",
			},
		];
	},
	async rewrites() {
		return [
			{
				destination: "/llms.mdx/:path*",
				source: "/:path*.mdx",
			},
		];
	},
} as const satisfies NextConfig;

const withMDX = createMDX();

export default withMDX(nextConfig);
