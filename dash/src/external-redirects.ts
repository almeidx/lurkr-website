import { BOT_INVITE, GITHUB_REPOSITORY_URL, PATREON_URL, SUPPORT_SERVER_INVITE, TOPGG_URL } from "./shared-links.ts";

/** Short links to other sites. Served by `next.config.ts` and kept out of search results by `robots.ts`. */
export const EXTERNAL_REDIRECTS = [
	{ destination: BOT_INVITE, permanent: false, source: "/invite" },
	{ destination: PATREON_URL, permanent: false, source: "/patreon" },
	{ destination: `${TOPGG_URL}&utm_campaign=redirect`, permanent: true, source: "/vote" },
	{ destination: GITHUB_REPOSITORY_URL, permanent: true, source: "/github" },
	{ destination: SUPPORT_SERVER_INVITE, permanent: true, source: "/support" },
] as const;
