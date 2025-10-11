import { isbot } from "isbot";
import { type NextRequest, NextResponse } from "next/server";
import { REDIRECT_TO_COOKIE, SIGN_IN_URL } from "@/utils/constants.ts";

export function proxy(request: NextRequest) {
	if (isbot(request.headers.get("user-agent"))) {
		return NextResponse.next();
	}

	return NextResponse.redirect(SIGN_IN_URL, {
		headers: {
			"Set-Cookie": `${REDIRECT_TO_COOKIE}=${request.nextUrl.pathname}; Path=/; HttpOnly; Max-Age=60;`,
		},
	});
}

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
