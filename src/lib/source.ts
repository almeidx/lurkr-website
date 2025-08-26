import { loader } from "fumadocs-core/source";
import { transformerOpenAPI } from "fumadocs-openapi/server";
import { createElement } from "react";
import { docs } from "../../.source";

export const source = loader({
	baseUrl: "/docs",
	icon(icon) {
		if (!icon) return undefined;
		return createElement("span", undefined, icon);
	},
	pageTree: {
		transformers: [transformerOpenAPI()],
	},
	source: docs.toFumadocsSource(),
});
