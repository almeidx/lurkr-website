"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import type { GuildSettings } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export async function action(guildId: string, data: Partial<GuildSettings>, tag: string, premium: boolean) {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	const route = premium ? `/guilds/${guildId}/premium` : `/guilds/${guildId}`;

	const response = await makeApiRequest(route, token, {
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
		method: "PATCH",
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
