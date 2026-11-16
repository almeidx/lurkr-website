import type { MetadataRoute } from "next";
import { EXTERNAL_REDIRECTS } from "@/external-redirects.ts";
import { PUBLIC_URL } from "@/utils/constants.ts";

export default function robots(): MetadataRoute.Robots {
	if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "prod") {
		return {
			rules: {
				disallow: "/",
				userAgent: "*",
			},
		};
	}

	return {
		rules: {
			allow: ["/", "/guilds$"],
			disallow: ["/api/", "/guilds/", ...EXTERNAL_REDIRECTS.map(({ source }) => source)],
			userAgent: "*",
		},
		sitemap: `${PUBLIC_URL}sitemap.xml`,
	};
}
