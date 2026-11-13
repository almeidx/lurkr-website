import path from "node:path";
import openapiPlugin from "fumadocs-openapi/press";
import { createOpenAPI } from "fumadocs-openapi/server";
import { createPress, type HeadTag, recommendedPreset } from "fumapress";
import { oramaSearchPlugin } from "fumapress/plugins/orama-search";
import logoSmall from "@/assets/logo-small.webp";
import { OpenAPIPage } from "@/openapi.tsx";
import { BASE_URL } from "@/shared-links.ts";
import { docs } from "./.source/server";

const BRAND_COLOR = "#ff7077";
const OPENAPI_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replaceAll(/[^a-z0-9]+/g, "-")
		.replaceAll(/^-+|-+$/g, "");

const openapi = createOpenAPI({
	input: [path.resolve("./openapi.json")],
});

export const app = createPress({
	docs: docs.toFumadocsSource(),
	// API reference pages are generated from the live OpenAPI spec at build
	// time (replaces the old scripts/generate-api-endpoint-docs.ts): one page
	// per operation, grouped by tag into `/api/endpoints/{tag}`, named by the
	// slugified operation summary.
	openapi: await openapi.staticSource({
		baseDir: "api/endpoints",
		groupBy: "tag",
		name(output) {
			if (output.type !== "operation") return "index";
			const { method, path: operationPath } = output.item;
			const operation = this.document.paths?.[operationPath]?.[method];
			const summarySlug = slugify(operation && !("$ref" in operation) ? (operation.summary ?? "") : "");
			const routeSlug = slugify(`${method}-${operationPath}`);
			if (!summarySlug || !operation || "$ref" in operation) return routeSlug;

			const tags = operation.tags?.length ? operation.tags : ["unknown"];
			const hasCollision = Object.entries(this.document.paths ?? {}).some(([candidatePath, pathItem]) => {
				if (!pathItem || "$ref" in pathItem) return false;

				return OPENAPI_METHODS.some((candidateMethod) => {
					if (candidatePath === operationPath && candidateMethod === method) return false;
					const candidate = pathItem[candidateMethod];
					if (!candidate || "$ref" in candidate || slugify(candidate.summary ?? "") !== summarySlug) return false;

					const candidateTags = candidate.tags?.length ? candidate.tags : ["unknown"];
					return tags.some((tag) => candidateTags.includes(tag));
				});
			});

			return hasCollision ? `${summarySlug}-${routeSlug}` : summarySlug;
		},
		per: "operation",
	}),
}).plugins(oramaSearchPlugin(), openapiPlugin({ ClientAPIPage: OpenAPIPage, server: openapi }));

export default app.config({
	head({ page }): HeadTag[] {
		if (page) return [];

		return [
			{ attrs: { href: "https://fonts.googleapis.com", rel: "preconnect" }, tag: "link" },
			{ attrs: { crossorigin: "", href: "https://fonts.gstatic.com", rel: "preconnect" }, tag: "link" },
			{
				attrs: {
					href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
					rel: "stylesheet",
				},
				tag: "link",
			},
			{ attrs: { href: this.withBase("/favicon.ico"), rel: "icon", type: "image/x-icon" }, tag: "link" },
			{ attrs: { href: this.withBase("/icon.png"), rel: "icon", type: "image/png" }, tag: "link" },
			// Purposefully pointing to the manifest in the root site instead.
			{ attrs: { href: "/manifest.json", rel: "manifest" }, tag: "link" },
			{ attrs: { content: "Lurkr", name: "application-name" }, tag: "meta" },
			{ attrs: { content: BRAND_COLOR, name: "theme-color" }, tag: "meta" },
			{ attrs: { content: "Lurkr", property: "og:site_name" }, tag: "meta" },
			{ attrs: { content: "website", property: "og:type" }, tag: "meta" },
			{ attrs: { content: BRAND_COLOR, name: "msapplication-TileColor" }, tag: "meta" },
		];
	},
	// Orama (listed above) replaces the default FlexSearch search. RSS and
	// robots.txt stay off, as they were in v1. Image optimization needs a server,
	// which a static export has none of.
	preset: recommendedPreset({ image: false, robots: false, rss: false, search: false }),
	site: {
		baseUrl: import.meta.env.DEV ? "http://localhost:3000/docs" : `${BASE_URL}/docs`,
		git: {
			branch: "main",
			repo: "lurkr-website",
			rootDir: "docs",
			user: "almeidx",
		},
		name: "Lurkr Docs",
	},
	ui: {
		layoutProps: {
			links: [
				{
					text: "Open Dashboard",
					url: BASE_URL,
				},
			],
			nav: {
				title: (
					<>
						<img alt="Lurkr" className="size-5" height={20} src={logoSmall} width={20} />
						<span className="font-medium">Lurkr Docs</span>
					</>
				),
			},
		},
	},
});
