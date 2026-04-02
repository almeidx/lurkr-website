import { createFileRoute } from "@tanstack/react-router";
import { resolvePageUrl } from "@/lib/shared.ts";
import { source } from "@/lib/source.ts";
import { PUBLIC_URL } from "@/utils/constants.ts";
import { isValidDate } from "@/utils/is-valid-date.ts";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET() {
				const urls = source.getPages().map((page) => {
					const isEntrypoint = page.url === "/" || page.url === "/api";
					const lastModified = isValidDate(page.data.lastModified) ? page.data.lastModified.toISOString() : undefined;
					const loc = new URL(resolvePageUrl(page.url), PUBLIC_URL).toString();

					return [
						"<url>",
						`<loc>${loc}</loc>`,
						"<changefreq>weekly</changefreq>",
						`<priority>${isEntrypoint ? "0.8" : "0.5"}</priority>`,
						lastModified ? `<lastmod>${lastModified}</lastmod>` : "",
						"</url>",
					]
						.filter(Boolean)
						.join("");
				});

				return new Response(
					[
						'<?xml version="1.0" encoding="UTF-8"?>',
						'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
						...urls,
						"</urlset>",
					].join(""),
					{
						headers: {
							"Content-Type": "application/xml; charset=utf-8",
						},
					},
				);
			},
		},
	},
});
