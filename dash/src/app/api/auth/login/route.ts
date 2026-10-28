import { NextResponse } from "next/server";
import { AUTH_CALLBACK_PATH, OAUTH_STATE_COOKIE, PUBLIC_URL } from "@/utils/constants.ts";

const STATE_MAX_AGE_SECONDS = 600;

const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ?? "";
if (!clientId) {
	console.warn("Missing NEXT_PUBLIC_DISCORD_CLIENT_ID environment variable. Sign-in will not work.");
}

const discordAuthorizeUrl = new URL("https://discord.com/api/oauth2/authorize");
discordAuthorizeUrl.searchParams.set("client_id", clientId);
discordAuthorizeUrl.searchParams.set("redirect_uri", new URL(AUTH_CALLBACK_PATH, PUBLIC_URL).href);
discordAuthorizeUrl.searchParams.set("response_type", "code");
discordAuthorizeUrl.searchParams.set("scope", "identify guilds");
discordAuthorizeUrl.searchParams.set("prompt", "none");

const AUTHORIZE_URL_WITHOUT_STATE = discordAuthorizeUrl.href;

export function GET() {
	const state = generateState();

	const authorizeUrl = new URL(AUTHORIZE_URL_WITHOUT_STATE);
	authorizeUrl.searchParams.set("state", state);

	const response = NextResponse.redirect(authorizeUrl);
	response.headers.set("Cache-Control", "no-store");
	response.cookies.set(OAUTH_STATE_COOKIE, state, {
		httpOnly: true,
		maxAge: STATE_MAX_AGE_SECONDS,
		path: AUTH_CALLBACK_PATH,
		sameSite: "lax",
		secure: true,
	});

	return response;
}

function generateState() {
	return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
