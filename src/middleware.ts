import { REDIRECT_TO_COOKIE, SIGN_IN_URL } from "@/utils/constants.ts";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	return NextResponse.redirect(SIGN_IN_URL, {
		headers: {
			"Set-Cookie": `${REDIRECT_TO_COOKIE}=${request.nextUrl.pathname}; Path=/; HttpOnly; Max-Age=60;`,
		},
	});
}

export const config = {
	matcher: [
		{
			source: "/guilds/:path*",
			missing: [
				{ type: "cookie", key: "token" },
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
		{
			source: "/levels/:entry/me",
			missing: [
				{ type: "cookie", key: "token" },
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
		{
			source: "/profile",
			missing: [
				{ type: "cookie", key: "token" },
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
