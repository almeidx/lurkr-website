import type { NextRequest } from "next/server";
import { PUBLIC_URL } from "@/utils/constants.ts";

export const revalidate = false;

export function GET(_request: NextRequest) {
	return new Response(
		`
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${PUBLIC_URL}sitemap-dashboard.xml</loc>
	</sitemap>
	<sitemap>
		<loc>${PUBLIC_URL}docs/sitemap.xml</loc>
	</sitemap>
</sitemapindex>
    `.trim(),
		{
			headers: { "Content-Type": "application/xml" },
		},
	);
}
