import { REDIRECT_TO_COOKIE, SIGN_IN_URL } from "@/utils/constants.ts";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/guilds")) {
		return NextResponse.redirect(SIGN_IN_URL, {
			headers: {
				"Set-Cookie": `${REDIRECT_TO_COOKIE}=${request.nextUrl.pathname}; Path=/; HttpOnly; Max-Age=60;`,
			},
		});
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		{
			source: "/guilds/:path*",
			missing: [{ type: "cookie", key: "token" }],
		},
	],
};
