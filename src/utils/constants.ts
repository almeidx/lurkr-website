export const DESCRIPTION =
	"The Ultimate No-Paywall & Featureful Leveling Bot. Powerful Utility and Automation for your Best Discord Server!";
export const BRAND_COLOR = "#ff7077";

export const MAX_WINDOW_TITLE_LENGTH = 60;

const baseUrl = process.env.NEXT_PUBLIC_URL!;
const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;

const signInUrl = new URL("https://discord.com/api/oauth2/authorize");
signInUrl.searchParams.set("client_id", clientId);
signInUrl.searchParams.set("redirect_uri", `${baseUrl}/api/auth/callback`);
signInUrl.searchParams.set("response_type", "code");
signInUrl.searchParams.set("scope", "identify guilds");
signInUrl.searchParams.set("prompt", "none");

export const SIGN_IN_URL = signInUrl.toString();

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const inviteUrl = new URL("https://discord.com/oauth2/authorize");
inviteUrl.searchParams.set("client_id", clientId);
inviteUrl.searchParams.set("scope", "bot applications.commands");
inviteUrl.searchParams.set("permissions", "276220472384");

export const BOT_INVITE = inviteUrl.toString();

export const TOKEN_COOKIE = "token";
export const REDIRECT_TO_COOKIE = "redirectTo";
