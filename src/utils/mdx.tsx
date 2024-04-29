import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import grayMatter from "gray-matter";

const docsDir = join(process.cwd(), "docs");
let cache: ReturnType<typeof getMDXData> | null = null;

export function getDocumentationPages() {
	if (process.env.NODE_ENV === "development") {
		return getMDXData(docsDir);
	}

	cache ??= getMDXData(docsDir);

	return cache;
}

function getMDXFiles(dir: string) {
	const files = readdirSync(dir, { withFileTypes: true });
	const allFiles: string[] = [];

	for (const file of files) {
		const filePath = join(file.path, file.name);

		if (file.isDirectory()) {
			const subFiles = getMDXFiles(filePath);
			allFiles.push(...subFiles);
		} else if (extname(file.name) === ".mdx") {
			allFiles.push(filePath);
		}
	}

	return allFiles;
}

function readMDXFile(filePath: string) {
	const rawContent = readFileSync(filePath, "utf-8");
	const { content, data } = grayMatter(rawContent);

	return {
		content,
		metadata: data as Metadata,
	};
}

function getMDXData(dir: string) {
	const mdxFiles = getMDXFiles(dir);

	return mdxFiles.map((file) => {
		const { metadata, content } = readMDXFile(file);
		const slug = relative(dir, file)
			.replace(/\.mdx$/, "")
			.replaceAll("\\", "/");

		return {
			metadata,
			slug,
			content,
		};
	});
}

interface Metadata {
	title: string;
	publishedAt: Date;
	summary: string;
}
