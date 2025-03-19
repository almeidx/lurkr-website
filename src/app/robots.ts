import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	if (process.env.ENVIRONMENT !== "prod") {
		return {
			rules: {
				userAgent: "*",
				disallow: "/",
			},
		};
	}

	return {
		rules: {
			userAgent: "*",
			allow: "/",
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
		},
	};
}
