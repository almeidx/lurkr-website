import { REDIRECT_TO_COOKIE, TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	if (!request.nextUrl.searchParams.has("code")) {
		// NextResponse.error() is not implemented
		// return NextResponse.error();

		console.error("Missing code parameter: ", request.nextUrl.toString());

		return new Response("Missing code parameter", { status: 400 });
	}

	const code = request.nextUrl.searchParams.get("code");

	const redirectTo = getRedirectToValue(request.cookies.get(REDIRECT_TO_COOKIE)?.value, request.nextUrl.origin);

	const registerResponse = await makeApiRequest("/auth/register", null, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Environment": process.env.ENVIRONMENT ?? "prod",
		},
		body: JSON.stringify({ code }),
	});

	if (!registerResponse.ok) {
		console.error("Failed to register user:", await registerResponse.text());

		// return NextResponse.error();
		return new Response("Failed to register user", { status: 500 });
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
