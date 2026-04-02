import { glob, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { generateFiles } from "fumadocs-openapi";
import slugify from "slugify";
import { openapi } from "../src/lib/openapi.ts";

const output = join(".", "content", "api", "endpoints");
const manifestOutput = join(".", "src", "generated", "openapi-page-manifest.ts");
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

		const tag = slugify(operation.tags[0] ?? "api", { lower: true, strict: true, trim: true });
		const summary = slugify(operation.summary, { lower: true, strict: true, trim: true });

		return `${tag}/${summary}`;
	},
	output,
});

const manifestEntries: Record<
	string,
	{
		document: string;
		operations: Array<{
			method: string;
			path: string;
		}>;
	}
> = {};
const generatedFiles = glob(`${output}/**/*.mdx`);

for await (const file of generatedFiles) {
	const source = await readFile(file, "utf8");
	const match = source.match(/<APIPage\s+document=\{(".*?")\}\s+operations=\{(\[[\s\S]*?\])\}\s*\/>/);

	if (!match) {
		continue;
	}

	const rawDocument = match[1];
	const rawOperations = match[2];
	if (!rawDocument || !rawOperations) {
		continue;
	}

	const manifestPath = relative("content", file).replaceAll("\\", "/");

	manifestEntries[manifestPath] = {
		document: JSON.parse(rawDocument) as string,
		operations: JSON.parse(rawOperations) as Array<{
			method: string;
			path: string;
		}>,
	};
}

await mkdir(dirname(manifestOutput), { recursive: true });
await writeFile(
	manifestOutput,
	`${[
		'import type { ClientApiPageProps } from "fumadocs-openapi/ui/create-client";',
		"",
		"type OpenAPIPageManifestEntry = {",
		"\tdocument: string;",
		'\toperations: ClientApiPageProps["operations"];',
		"};",
		"",
		"export const openApiPageManifest: Record<string, OpenAPIPageManifestEntry> =",
		`${JSON.stringify(Object.fromEntries(Object.entries(manifestEntries).sort(([a], [b]) => a.localeCompare(b))), null, "\t")};`,
		"",
	].join("\n")}`,
	"utf8",
);
