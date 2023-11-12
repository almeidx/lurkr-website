import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
	const redirectUrl = new URL("/", request.url);

	return NextResponse.redirect(redirectUrl, {
		headers: {
			"Set-Cookie": `${TOKEN_COOKIE}=; Path=/; Max-Age=0;`,
		},
	});
}
