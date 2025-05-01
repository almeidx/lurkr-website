import { glob, rename, rm, writeFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { generateFiles } from "fumadocs-openapi";
import grayMatter from "gray-matter";
import slugify from "slugify";

const output = join(".", "content", "api", "endpoints");
const filesIter = glob(`${output}/**/*.{mdx,json}`);

for await (const file of filesIter) {
	await rm(file);
}

await generateFiles({
	input: ["https://api.lurkr.gg/v2/docs/json"],
	output,
	includeDescription: true,
	per: "operation",
	groupBy: "tag",
});

await fixFilesStructure();

console.log("Updated files structure.");

async function fixFilesStructure() {
	const outputFiles = glob(`${output}/**/*.mdx`);

	const tags = new Set();

	for await (const file of outputFiles) {
		const { data } = grayMatter.read(file);
		const { title } = data;

		const tag = file.replace(output, "").split(sep)[1]; // first item is an empty string

		tags.add(tag);

		const slug = slugify(title).toLowerCase();
		const newFile = join(output, tag, `${slug}.mdx`);
		await rename(file, newFile);
	}

	const metaContent = `${JSON.stringify({ defaultOpen: true }, null, "\t")}\n`;

	for (const tag of tags) {
		const tagFile = join(output, tag, "meta.json");
		await writeFile(tagFile, metaContent);
	}
}
