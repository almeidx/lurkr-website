import { glob, readFile } from "node:fs/promises";
import { remarkInclude } from "fumadocs-mdx/config";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";

export const revalidate = false;

const processor = remark() //
	.use(remarkMdx)
	.use(remarkInclude)
	.use(remarkGfm)
	.use(remarkStringify);

export async function GET() {
	const filesIter = glob("./content/**/*.mdx");
	const results: string[] = [];

	for await (const file of filesIter) {
		const fileContent = await readFile(file, "utf-8");
		const { content, data } = matter(fileContent);

		const processed = await processor.process({
			path: file,
			value: content,
		});

		results.push(`file: ${file}
meta: ${JSON.stringify(data, null, 2)}
        
${processed}`);
	}

	return new Response(results.join("\n\n"));
}
