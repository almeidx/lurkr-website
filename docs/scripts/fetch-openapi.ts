import { writeFile } from "node:fs/promises";

const SPEC_URL = "https://api.lurkr.gg/v2/docs/json";
const OUTPUT = new URL("../openapi.json", import.meta.url);

const response = await fetch(SPEC_URL);
if (!response.ok) {
	throw new Error(`Failed to fetch OpenAPI spec from ${SPEC_URL}: ${response.status} ${response.statusText}`);
}

if (!response.headers.get("content-type")?.includes("application/json")) {
	throw new Error(`Expected JSON response from openapi spec, but got ${response.headers.get("content-type")}`);
}

const document = await response.bytes();

await writeFile(OUTPUT, document);
console.log(`[openapi] wrote ${document.byteLength} bytes to openapi.json`);
