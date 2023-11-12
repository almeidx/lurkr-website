import { REDIRECT_TO_COOKIE, SIGN_IN_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/guilds") && !request.cookies.has(TOKEN_COOKIE)) {
		return NextResponse.redirect(SIGN_IN_URL, {
			headers: {
				"Set-Cookie": `${REDIRECT_TO_COOKIE}=${request.nextUrl.pathname}; Path=/; HttpOnly; Max-Age=60;`,
			},
		});
	}

	if (request.nextUrl.pathname.startsWith("/levels")) {
		const pageParam = request.nextUrl.searchParams.get("page");
		const floatPage = pageParam ? Number(pageParam) : null;
		const page = pageParam ? Number.parseInt(pageParam) : null;

		// Page number must be an integer between 1 and 1,000
		if (!floatPage || floatPage !== page || page < 1 || page > 1000) {
			const cloneUrl = request.nextUrl.clone();
			cloneUrl.searchParams.set("page", "1");

			return NextResponse.redirect(cloneUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/guilds/:path*", "/levels/((?!calculator).+)"],
};
