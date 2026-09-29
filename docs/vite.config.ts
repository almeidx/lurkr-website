import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import press from "fumapress/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		press({
			// The docs site is served under lurkr.gg/docs (the dashboard owns the root).
			// The custom server entry below makes this a static Cloudflare export.
			adapter: "waku/adapters/cloudflare",
			basePath: "/docs/",
		}),
		fumadocsMdx(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve("./src"),
		},
	},
});
