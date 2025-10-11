import { updateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/utils/constants.ts";

export function GET(request: NextRequest) {
	const redirectUrl = new URL("/", request.url);

	updateTag("user");

	return NextResponse.redirect(redirectUrl, {
		headers: {
			"Set-Cookie": `${TOKEN_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`,
		},
	});
}
