import path from "node:path";
import { createOpenAPI } from "fumadocs-openapi/server";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { openapiPlugin } from "fumapress/plugins/openapi";
import { oramaSearchPlugin } from "fumapress/plugins/orama-search";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import logoSmall from "@/assets/logo-small.webp";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { OpenAPIPage } from "@/openapi.tsx";
import { BASE_URL } from "@/shared-links.ts";
import { docs } from "./.source/server";

const BRAND_COLOR = "#ff7077";
const OPENAPI_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const openapi = createOpenAPI({
	input: [path.resolve("./openapi.json")],
});

export default defineConfig({
	content: {
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
	},
	defaultLayoutProps: {
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
	meta: {
		root() {
			return (
				<>
					<link href="https://fonts.googleapis.com" rel="preconnect" />
					<link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
					<link
						href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
						rel="stylesheet"
					/>
					<link href="/docs/favicon.ico" rel="icon" type="image/x-icon" />
					<link href="/docs/icon.png" rel="icon" type="image/png" />
					{/* Purposefully pointing to the manifest in the root site instead. */}
					<link href="/manifest.json" rel="manifest" />
					<meta content="Lurkr" name="application-name" />
					<meta content={BRAND_COLOR} name="theme-color" />
					<meta content="Lurkr" property="og:site_name" />
					<meta content="website" property="og:type" />
					<meta content={BRAND_COLOR} name="msapplication-TileColor" />
				</>
			);
		},
	},
	mode: "static",
	// Plugins are enumerated below; the v1 default preset also adds RSS and robots.
	preset: false,
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
})
	.adapters(
		fumadocsMdx({
			async getMdxComponents(page) {
				const source = await this.getLoader();

				return {
					...defaultMdxComponents,
					a: createRelativeLink(source, page),
					ExternalLink,
				};
			},
		}),
	)
	.plugins(
		oramaSearchPlugin(),
		llmsPlugin(),
		takumiPlugin(),
		sitemapPlugin(),
		openapiPlugin({ ClientAPIPage: OpenAPIPage, server: openapi }),
	);
