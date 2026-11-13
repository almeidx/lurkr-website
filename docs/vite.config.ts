import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import press from "fumapress/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		press({
			// The docs site is served under lurkr.gg/docs (the dashboard owns the root).
			// Every page is prerendered, so the build is a static export with no
			// server code to deploy. Pin the Node.js adapter: on Workers Builds,
			// Fumapress would otherwise pick the Cloudflare adapter, whose bundle
			// cannot run the static generation (a CJS `require("process")` in `yaml`).
			adapter: "waku/adapters/node",
			basePath: "/docs/",
			components: "./src/components/mdx.tsx",
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
