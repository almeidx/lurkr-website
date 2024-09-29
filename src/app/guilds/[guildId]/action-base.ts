"use server";

import type { GuildSettings } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function action(guildId: string, data: Partial<GuildSettings>, tag: string) {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	console.log(data);

	const response = await makeApiRequest(`/guilds/${guildId}`, token, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = response.headers.get("content-type")?.includes("application/json")
			? await response.json()
			: await response.text();

		console.error(`Failed to update guild ${guildId} settings:`, error);

		return false;
	}

	revalidateTag(tag);

	return true;
}
