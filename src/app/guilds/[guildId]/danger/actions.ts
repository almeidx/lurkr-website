"use server";

import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { snowflake } from "@/utils/schemas.ts";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { parse } from "valibot";

export async function resetGuildDataAction(guildIdInput: string) {
	const guildId = parse(snowflake, guildIdInput);

	const token = cookies().get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Unauthorized");
	}

	const response = await makeApiRequest(`/guilds/${guildId}`, token, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Failed to reset guild data");
	}

	revalidateTag(`settings:${guildId}`);
}
