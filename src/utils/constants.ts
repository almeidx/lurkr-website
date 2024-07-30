export const DESCRIPTION =
	"The Ultimate No-Paywall & Featured Leveling Bot. Transfer your MEE6/Amari Leaderboard to get started!";
export const BRAND_COLOR = "#ff7077";

export const MAX_WINDOW_TITLE_LENGTH = 60;

export const BASE_URL = process.env.NEXT_PUBLIC_URL!;
const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;

const signInUrl = new URL("https://discord.com/api/oauth2/authorize");
signInUrl.searchParams.set("client_id", clientId);
signInUrl.searchParams.set("redirect_uri", `${BASE_URL}/api/auth/callback`);
signInUrl.searchParams.set("response_type", "code");
signInUrl.searchParams.set("scope", "identify guilds");
signInUrl.searchParams.set("prompt", "none");

export const SIGN_IN_URL = signInUrl.toString();

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// The middleware `missing[0].key` must be updated manually, if this is changed
export const TOKEN_COOKIE = "token";
export const REDIRECT_TO_COOKIE = "redirectTo";

export const DOCS_URL = "https://docs.lurkr.gg";
