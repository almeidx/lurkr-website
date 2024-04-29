import { BASE_URL } from "@/utils/constants.ts";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				disallow: "/guilds/",
			},
			{
				userAgent: "*",
				allow: "/",
			},
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}
