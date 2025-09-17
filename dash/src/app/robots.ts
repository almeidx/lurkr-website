import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	if (process.env.ENVIRONMENT !== "prod") {
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
	};
}
