import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { createElement } from "react";
import { openapi } from "@/lib/openapi.ts";

export const source = loader({
	// The Next app itself is mounted at /docs via basePath, so Fumadocs links stay app-local.
	baseUrl: "/",
	icon(icon) {
		if (!icon) return undefined;
		return createElement("span", { key: icon }, icon);
	},
	plugins: [openapi.loaderPlugin()],
	source: docs.toFumadocsSource(),
});

export function getPageImage(page: InferPageType<typeof source>) {
	const segments = [...page.slugs, "image.png"];

	return {
		segments,
		url: `/og/${segments.join("/")}`,
	};
}

export async function getLLMText(page: InferPageType<typeof source>) {
	const processed = await page.data.getText("processed");

	return `# ${page.data.title} (${resolvePageUrl(page.url)})

${processed}`;
}

export function resolvePageUrl(pageUrl: string) {
	return `/docs${pageUrl.replace(/\/$/, "")}`;
}
