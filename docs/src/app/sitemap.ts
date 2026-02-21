import type { MetadataRoute } from "next";
import { resolvePageUrl, source } from "@/lib/source.ts";
import { PUBLIC_URL } from "@/utils/constants.ts";
import { isValidDate } from "@/utils/is-valid-date.ts";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		...source.getPages().flatMap((page) => {
			const { lastModified } = page.data;

			const isEntrypoint = page.url === "/" || page.url === "/api";
			const url = new URL(resolvePageUrl(page.url), PUBLIC_URL).toString();

			return {
				changeFrequency: "weekly",
				lastModified: isValidDate(lastModified) ? lastModified : undefined,
				priority: isEntrypoint ? 0.8 : 0.5,
				url,
			} satisfies MetadataRoute.Sitemap[number];
		}),
	];
}
