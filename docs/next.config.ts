import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { getNextConfigHeaders } from "../shared/common.ts";

const nextConfig = {
	basePath: "/docs",
	experimental: {
		reactCompiler: true,
		// ppr: true,
	},
	async headers() {
		return getNextConfigHeaders();
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	typescript: {
		ignoreBuildErrors: true,
	},
} as const satisfies NextConfig;

const withMDX = createMDX();

export default withMDX(nextConfig);
