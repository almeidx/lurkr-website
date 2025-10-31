import { type InferPageType, loader } from "fumadocs-core/source";
import { openapiPlugin } from "fumadocs-openapi/server";
import { createElement } from "react";
import { docs } from "../../.source/server";

export const source = loader({
	baseUrl: "/",
	icon(icon) {
		if (!icon) return undefined;
		return createElement("span", { key: icon }, icon);
	},
	plugins: [openapiPlugin()],
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

	return `# ${page.data.title}

${processed}`;
}
