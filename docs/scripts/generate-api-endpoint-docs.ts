import { glob, rm } from "node:fs/promises";
import { join } from "node:path";
import { generateFiles } from "fumadocs-openapi";
import slugify from "slugify";
import { openapi } from "../src/lib/openapi.ts";

const output = join(".", "content", "api", "endpoints");
const filesIter = glob(`${output}/**/*.{mdx,json}`);

for await (const file of filesIter) {
	await rm(file);
}

await generateFiles({
	includeDescription: true,
	input: openapi,
	name(output, document) {
		if (output.type !== "operation") throw new Error(`I don't know what ${output.type} is`);

		const operation = (document as any).paths![output.item.path]![output.item.method] as {
			summary: string;
			tags: string[];
			// There are more properties, but we don't care about them
		};

		return `${operation.tags[0]}/${slugify(operation.summary).toLowerCase()}`;
	},
	output,
});
