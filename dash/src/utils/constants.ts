export const DESCRIPTION =
	"The ultimate no-paywall & featureful leveling bot. Transfer your MEE6/Amari/Polaris leaderboard to get started!";
export const BRAND_COLOR = "#ff7077";

export const MAX_WINDOW_TITLE_LENGTH = 60;

const BASE_URL =
	process.env.NEXT_PUBLIC_URL ||
	(process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
	"https://lurkr.gg";

export const PUBLIC_URL = new URL(BASE_URL);

export const SIGN_IN_URL = "/api/auth/login";

export const AUTH_CALLBACK_PATH = "/api/auth/callback";
export const OAUTH_STATE_COOKIE = "oauthState";

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// The middleware `missing[0].key` must be updated manually, if this is changed
export const TOKEN_COOKIE = "token";

const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

export const TOKEN_COOKIE_SCOPE = cookieDomain
	? ({ domain: cookieDomain, path: "/" } as const)
	: ({ path: "/" } as const);

export const REDIRECT_TO_COOKIE = "redirectTo";

export const COOKIE_NOTICE_COOKIE = "biscuits";
export const COOKIE_NOTICE_ACK = "aye";

export const DEFAULT_ACCENT_COLOR = "#bebebe";

export const NSFW_CONSENT_COOKIE = "nsfw-consent";
export const NSFW_CONSENT_ACK = "aye";
export const NSFW_CONSENT_DAYS = 30;

export const WRAPPED_2025_NOTICE_COOKIE = "wrapped-dismissed-2025";
