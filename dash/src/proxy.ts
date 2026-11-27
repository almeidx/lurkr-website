import { isBot } from "isbot";
import { type NextRequest, NextResponse } from "next/server";
import { REDIRECT_TO_COOKIE, SIGN_IN_URL } from "@/utils/constants.ts";

export function proxy(request: NextRequest) {
	if (isBot(request.headers.get("user-agent"))) {
		return NextResponse.next();
	}

	const response = NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
	response.cookies.set(REDIRECT_TO_COOKIE, request.nextUrl.pathname, {
		httpOnly: true,
		maxAge: 60,
		path: "/",
		sameSite: "lax",
		secure: true,
	});

	return response;
}

// Keep in sync with `ALLOWED_REDIRECT_PATHNAME` in `src/app/api/auth/callback/route.ts`
export const config = {
	matcher: [
		{
			missing: [
				{ key: "token", type: "cookie" },
				{ key: "next-router-prefetch", type: "header" },
				{ key: "purpose", type: "header", value: "prefetch" },
			],
			source: "/guilds/:path*",
		},
		{
			missing: [
				{ key: "token", type: "cookie" },
				{ key: "next-router-prefetch", type: "header" },
				{ key: "purpose", type: "header", value: "prefetch" },
			],
			source: "/levels/:entry/me",
		},
		{
			missing: [
				{ key: "token", type: "cookie" },
				{ key: "next-router-prefetch", type: "header" },
				{ key: "purpose", type: "header", value: "prefetch" },
			],
			source: "/profile",
		},
	],
};
