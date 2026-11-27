import { timingSafeEqual } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/lib/api.ts";
import {
	AUTH_CALLBACK_PATH,
	LOGIN_FAILURE_PARAM,
	OAUTH_STATE_COOKIE,
	REDIRECT_TO_COOKIE,
	TOKEN_COOKIE,
	TOKEN_COOKIE_SCOPE,
} from "@/utils/constants.ts";

export async function GET(request: NextRequest) {
	const homeUrl = new URL("/", request.url);

	if (request.nextUrl.searchParams.get("error") === "access_denied") {
		return withStateCleared(NextResponse.redirect(homeUrl));
	}

	const failureUrl = new URL(homeUrl);
	failureUrl.searchParams.set(LOGIN_FAILURE_PARAM, "1");

	const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
	const state = request.nextUrl.searchParams.get("state");

	if (!isMatchingState(state, expectedState)) {
		return withStateCleared(NextResponse.redirect(failureUrl));
	}

	const code = request.nextUrl.searchParams.get("code");
	if (!code) {
		return withStateCleared(NextResponse.redirect(failureUrl));
	}

	const redirectTo = getRedirectToValue(request.cookies.get(REDIRECT_TO_COOKIE)?.value, request.nextUrl.origin);

	const registration = await publicApi
		.post("auth/register", {
			headers: { "X-Environment": process.env.NEXT_PUBLIC_ENVIRONMENT ?? "prod" },
			json: { code },
		})
		.json<RegisterResponse>()
		.catch((error: unknown) => {
			console.error("Failed to register user:", error);
			return null;
		});

	if (!registration) {
		const response = NextResponse.redirect(failureUrl);
		response.cookies.delete({ name: TOKEN_COOKIE, ...TOKEN_COOKIE_SCOPE });
		return withStateCleared(response);
	}

	const { token, maxAge } = registration;

	const response = NextResponse.redirect(redirectTo ?? homeUrl);
	response.cookies.set(TOKEN_COOKIE, token, {
		...TOKEN_COOKIE_SCOPE,
		httpOnly: true,
		maxAge,
		sameSite: "lax",
		secure: true,
	});
	return withStateCleared(response);
}

function isMatchingState(state: string | null, expectedState: string | undefined) {
	if (!state || !expectedState) {
		return false;
	}

	const received = Buffer.from(state);
	const expected = Buffer.from(expectedState);

	return received.length === expected.length && timingSafeEqual(received, expected);
}

function withStateCleared(response: NextResponse) {
	response.cookies.delete({ name: OAUTH_STATE_COOKIE, path: AUTH_CALLBACK_PATH });
	return response;
}

// Keep in sync with `config.matcher` in `src/proxy.ts`
const ALLOWED_REDIRECT_PATHNAME = /^\/(?:guilds(?:\/|$)|profile(?:\/|$)|levels\/[^/]+\/me$)/;

function getRedirectToValue(redirectTo: string | undefined, origin: string) {
	if (!redirectTo?.startsWith("/")) {
		return null;
	}

	const url = URL.parse(redirectTo, origin);
	if (url?.origin !== origin || !ALLOWED_REDIRECT_PATHNAME.test(url.pathname)) {
		return null;
	}
	return url;
}

interface RegisterResponse {
	token: string;
	maxAge: number;
}
