import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";

export const docs = defineDocs({
	dir: "content",
	docs: {
		postprocess: {
			includeProcessedMarkdown: true,
		},
		schema: frontmatterSchema,
	},
	meta: {
		schema: metaSchema,
	},
});

export default defineConfig({
	plugins: [lastModified()],
});
