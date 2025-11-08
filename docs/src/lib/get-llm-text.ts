import type { InferPageType } from "fumadocs-core/source";
import type { source } from "@/lib/source.ts";

export async function getLLMText(page: InferPageType<typeof source>) {
	const processed = await page.data.getText("processed");

	// Currently, doesn't seem like this respects next.js' basePath
	const llmPath = page.url.startsWith("/docs/") ? page.url : `/docs${page.url}`;

	return `# ${page.data.title} (${llmPath})

${processed}`;
}
