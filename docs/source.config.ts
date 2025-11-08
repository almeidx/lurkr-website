import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
	dir: "content",
	docs: {
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
});
