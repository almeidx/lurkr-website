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
	name(output) {
		if (output.type !== "operation") throw new Error(`I don't know what ${output.type} is`);

		const operation = this.fromExtractedOperation(output.item)?.operation;
		if (!operation) throw new Error(`Could not find ${output.item.method.toUpperCase()} ${output.item.path}`);

		const tag = slugify(operation.tags?.[0] ?? "api", { lower: true, strict: true, trim: true });
		const summary = slugify(operation.summary ?? output.item.path, { lower: true, strict: true, trim: true });

		return `${tag}/${summary}`;
	},
	output,
});
