"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE, TOKEN_COOKIE_SCOPE } from "@/utils/constants.ts";

export async function logout() {
	const cookieJar = await cookies();
	cookieJar.delete({ name: TOKEN_COOKIE, ...TOKEN_COOKIE_SCOPE });

	updateTag("user");

	redirect("/");
}
