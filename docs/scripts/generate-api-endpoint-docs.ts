import { glob, rm } from "node:fs/promises";
import { join } from "node:path";
import { generateFiles, type OperationItem } from "fumadocs-openapi";
import slugify from "slugify";
import { openapi } from "../src/lib/openapi.ts";

const output = join(".", "content", "api", "endpoints");
const filesIter = glob(`${output}/**/*.{mdx,json}`);
const slugifyOpenAPIName = (name: string) => slugify(name, { lower: true, strict: true, trim: true });
const openAPIMethods = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;

const operationGroupKey = (schemaId: string, item: OperationItem) =>
	`${schemaId}:operation:${item.path}:${item.method}`;

const outputGroups = new Map<string, string>();
const schemas = await openapi.getSchemas();

for (const [schemaId, { bundled: document }] of Object.entries(schemas)) {
	for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
		if (!pathItem || "$ref" in pathItem) continue;

		for (const method of openAPIMethods) {
			const operation = pathItem[method];
			if (!operation || "$ref" in operation) continue;

			outputGroups.set(operationGroupKey(schemaId, { method, path }), operation.tags?.[0] ?? "api");
		}
	}
}

for await (const file of filesIter) {
	await rm(file);
}

await generateFiles({
	groupBy(output) {
		if (output.type !== "operation") throw new Error(`I don't know what ${output.type} is`);

		return outputGroups.get(operationGroupKey(output.schemaId, output.item)) ?? "api";
	},
	includeDescription: true,
	input: openapi,
	name(output) {
		const document = this.document;

		if (output.type === "operation") {
			const pathItem = document.paths?.[output.item.path];
			if (!pathItem || "$ref" in pathItem) throw new Error(`Could not find ${output.item.path}`);

			const operation = pathItem[output.item.method];
			if (!operation || "$ref" in operation) {
				throw new Error(`Could not find ${output.item.method.toUpperCase()} ${output.item.path}`);
			}

			return slugifyOpenAPIName(operation.summary ?? output.item.path);
		}

		throw new Error(`I don't know what ${output.type} is`);
	},
	output,
	slugify: slugifyOpenAPIName,
});
