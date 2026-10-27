import { type NextRequest, NextResponse } from "next/server";
import { REDIRECT_TO_COOKIE, TOKEN_COOKIE, TOKEN_COOKIE_SCOPE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export async function GET(request: NextRequest) {
	if (!request.nextUrl.searchParams.has("code")) {
		return Response.json({ message: "Missing code parameter" }, { status: 400 });
	}

	const code = request.nextUrl.searchParams.get("code");

	const redirectTo = getRedirectToValue(request.cookies.get(REDIRECT_TO_COOKIE)?.value, request.nextUrl.origin);

	const registerResponse = await makeApiRequest("/auth/register", null, {
		body: JSON.stringify({ code }),
		headers: {
			"Content-Type": "application/json",
			"X-Environment": process.env.NEXT_PUBLIC_ENVIRONMENT ?? "prod",
		},
		method: "POST",
	});

	if (!registerResponse.ok) {
		console.error("Failed to register user:", await registerResponse.text());

		const redirectUrl = new URL("/", request.url);
		redirectUrl.searchParams.set("login_failure", "1");

		const response = NextResponse.redirect(redirectUrl);
		response.cookies.delete({ name: TOKEN_COOKIE, ...TOKEN_COOKIE_SCOPE });
		return response;
	}

	const { token, maxAge } = (await registerResponse.json()) as RegisterResponse;

	const redirectUrl = redirectTo ?? new URL("/", request.url);

	const response = NextResponse.redirect(redirectUrl);
	response.cookies.set(TOKEN_COOKIE, token, {
		...TOKEN_COOKIE_SCOPE,
		httpOnly: true,
		maxAge,
		sameSite: "lax",
		secure: true,
	});
	return response;
}

function getRedirectToValue(redirectTo: string | undefined, origin: string) {
	if (!redirectTo?.startsWith("/")) {
		return null;
	}

	const { pathname } = new URL(redirectTo, origin);

	return pathname.startsWith("/guilds") || pathname.startsWith("/profile") || /\/levels\/[^/]+\/me/.test(pathname)
		? new URL(pathname, origin)
		: null;
}

interface RegisterResponse {
	token: string;
	maxAge: number;
}
