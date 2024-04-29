import { BASE_URL } from "@/utils/constants.ts";

export const dynamic = "force-static";

export function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${BASE_URL}/docs/sitemap.xml</loc>
	</sitemap>
</sitemapindex>`,
		{
			headers: {
				"Content-Type": "application/xml",
			},
		},
	);
}
