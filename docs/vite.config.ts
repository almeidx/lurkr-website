import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import press from "fumapress/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		press({
			// The docs site is served under lurkr.gg/docs (the dashboard owns the root).
			// On Workers Builds, Fumapress picks the Cloudflare adapter by default,
			// whose bundle can't run static generation (a CJS `require("process")`
			// in `yaml`). The site is fully static, so the Node.js adapter is safe.
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
