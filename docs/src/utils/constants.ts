export const DESCRIPTION =
	"The ultimate no-paywall & featureful leveling bot. Transfer your MEE6/Amari/Polaris leaderboard to get started!";
export const BRAND_COLOR = "#ff7077";

export const MAX_WINDOW_TITLE_LENGTH = 60;

export const BASE_URL =
	process.env.NEXT_PUBLIC_URL ||
	(process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
	"https://lurkr.gg";

export const PUBLIC_URL = new URL("/docs", BASE_URL);

export const DEFAULT_ACCENT_COLOR = "#bebebe";
