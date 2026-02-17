"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "@/utils/constants.ts";

export async function logout() {
	const cookieJar = await cookies();
	cookieJar.delete(TOKEN_COOKIE);

	updateTag("user");
	updateTag("max");

	redirect("/");
}
