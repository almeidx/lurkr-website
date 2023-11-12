import { REDIRECT_TO_COOKIE, TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
	if (!request.nextUrl.searchParams.has("code")) {
		return NextResponse.error();
	}

	const code = request.nextUrl.searchParams.get("code");

	const redirectTo = getRedirectToValue(request.cookies.get(REDIRECT_TO_COOKIE)?.value, request.nextUrl.origin);

	const registerResponse = await makeApiRequest("/auth/register", null, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code }),
	});

	if (!registerResponse.ok) {
		console.error("Failed to register user:", await registerResponse.text());

		return NextResponse.error();
	}

	const { token, maxAge } = (await registerResponse.json()) as RegisterResponse;

	const redirectUrl = redirectTo ?? new URL("/", request.url);

	return NextResponse.redirect(redirectUrl, {
		headers: {
			"Set-Cookie": `${TOKEN_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
		},
	});
}

function getRedirectToValue(redirectTo: string | undefined, origin: string) {
	if (!redirectTo?.startsWith("/")) {
		return null;
	}

	const { pathname } = new URL(redirectTo, origin);

	return pathname.startsWith("/guilds") ? new URL(pathname, origin) : null;
}

interface RegisterResponse {
	token: string;
	maxAge: number;
}
