import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { getNextConfigHeaders } from "../shared/common.ts";

const nextConfig = {
	basePath: "/docs",
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
	typescript: {
		ignoreBuildErrors: true,
	},
} as const satisfies NextConfig;

const withMDX = createMDX();

export default withMDX(nextConfig);
