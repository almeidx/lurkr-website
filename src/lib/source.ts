import { loader } from "fumadocs-core/source";
import { attachFile, createOpenAPI } from "fumadocs-openapi/server";
import { createElement } from "react";
import { docs } from "../../.source";

export const source = loader({
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
	pageTree: {
		attachFile,
	},
	icon(icon) {
		if (!icon) return undefined;
		return createElement("span", undefined, icon);
	},
});

export const openapi = createOpenAPI({
	disablePlayground: true,
});
