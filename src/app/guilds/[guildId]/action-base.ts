"use server";

import type { GuildSettings } from "@/lib/guild.ts";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function action(guildId: string, data: Partial<GuildSettings>, tag: string) {
	const token = cookies().get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	console.log(data);

	await fetch(`${API_URL}/guilds/${guildId}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	revalidateTag(tag);
}
