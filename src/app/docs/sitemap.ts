import { BASE_URL } from "@/utils/constants.ts";
import { getDocumentationPages } from "@/utils/mdx.tsx";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const blogs = getDocumentationPages().map((post) => ({
		url: `${BASE_URL}/docs/${post.slug}`,
		lastModified: post.metadata.publishedAt,
	}));

	const routes = ["/docs"].map((route) => ({
		url: `${BASE_URL}${route}`,
		lastModified: new Date().toISOString().split("T")[0],
	}));

	return [...routes, ...blogs];
}
