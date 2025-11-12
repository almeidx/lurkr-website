import type { NextRequest } from "next/server";
import { PUBLIC_URL } from "@/utils/constants";

export const revalidate = false;

export function GET(_request: NextRequest) {
	const urls = [
		{ changeFrequency: "monthly", priority: 1, url: `${PUBLIC_URL}` },
		{ changeFrequency: "monthly", priority: 0.8, url: `${PUBLIC_URL}levels` },
		{ changeFrequency: "monthly", priority: 0.7, url: `${PUBLIC_URL}levels/calculator` },
		{ changeFrequency: "monthly", priority: 0.7, url: `${PUBLIC_URL}premium` },
		{ changeFrequency: "daily", priority: 0.5, url: `${PUBLIC_URL}status` },
		{ changeFrequency: "yearly", priority: 0.4, url: `${PUBLIC_URL}privacy` },
		{ changeFrequency: "yearly", priority: 0.4, url: `${PUBLIC_URL}terms` },
	] satisfies { changeFrequency: string; url: string; priority: number }[];

	return new Response(
		`
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
		.map((url) => {
			return `
  <url>
    <loc>${url.url}</loc>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>
      `.trimEnd();
		})
		.join("")}
</urlset>
    `.trim(),
		{
			headers: { "Content-Type": "application/xml" },
		},
	);
}
