"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { parse } from "valibot";
import type { GuildSettings } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { requiredSnowflake } from "@/utils/schemas.ts";

export async function action(rawGuildId: string, data: Partial<GuildSettings>, tag: string, premium: boolean) {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	const guildId = parse(requiredSnowflake, rawGuildId);

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

	updateTag(tag);

	return true;
}
