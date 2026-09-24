import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";

export const docs = defineDocs({
	dir: "content",
	docs: {
		async: true,
		postprocess: {
			includeProcessedMarkdown: true,
		},
		schema: pageSchema,
	},
	meta: {
		schema: metaSchema,
	},
});

export default defineConfig({
	plugins: [lastModified()],
});
