import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/docs/",
	optimizeDeps: {
		include: ["remark", "remark-gfm"],
	},
	plugins: [
		cloudflare({
			viteEnvironment: {
				name: "ssr",
			},
		}),
		mdx(await import("./source.config.ts")),
		tailwindcss(),
		tanstackStart({
			srcDirectory: "src",
		}),
		react(),
	],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		port: 3000,
	},
});
