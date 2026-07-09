import type { OpenAPIV3_2 } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

const openApiDocumentUrl = "https://api.lurkr.gg/v2/docs/json";

async function fetchOpenAPIDocument(): Promise<OpenAPIV3_2.Document> {
	const response = await fetch(openApiDocumentUrl);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch OpenAPI document from ${openApiDocumentUrl}: ${response.status} ${response.statusText}`,
		);
	}

	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.includes("json")) {
		throw new Error(`Expected JSON from ${openApiDocumentUrl}, received content-type "${contentType}"`);
	}

	const document: unknown = await response.json();
	if (typeof document !== "object" || document === null || !("openapi" in document)) {
		throw new Error(`Response from ${openApiDocumentUrl} is not an OpenAPI document`);
	}

	return document as OpenAPIV3_2.Document;
}

export const openapi = createOpenAPI({
	input: { lurkr: fetchOpenAPIDocument },
});
