"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { parse } from "valibot";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { snowflake } from "@/utils/schemas.ts";

export async function userLevelResetAction(guildIdInput: string, userIdInput: string) {
	const guildId = parse(snowflake, guildIdInput);
	const userId = parse(snowflake, userIdInput);

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Unauthorized");
	}

	const response = await makeApiRequest(`/levels/${guildId}/users/${userId}`, token, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Failed to reset user level");
	}

	updateTag(`levels:${guildId}`);
}
