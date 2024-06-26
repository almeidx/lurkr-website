import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
	const redirectUrl = new URL("/", request.url);

	revalidateTag("user");

	return NextResponse.redirect(redirectUrl, {
		headers: {
			"Set-Cookie": `${TOKEN_COOKIE}=; Path=/; Max-Age=0;`,
		},
	});
}
