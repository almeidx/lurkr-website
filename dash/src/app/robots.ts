import type { MetadataRoute } from "next";
import { PUBLIC_URL } from "@/utils/constants.ts";

export default function robots(): MetadataRoute.Robots {
	if (process.env.PUBLIC_ENVIRONMENT !== "prod") {
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
			disallow: [
				"/api/",
				"/guilds/",

				// Redirects:
				"/invite",
				"/patreon",
				"/vote",
				"/github",
				"/support",
			],
			userAgent: "*",
		},
		sitemap: `${PUBLIC_URL}sitemap.xml`,
	};
}
