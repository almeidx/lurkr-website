"use server";

import { refresh } from "next/cache";
import { parse } from "valibot";
import { api } from "@/lib/api.ts";
import { requiredSnowflake } from "@/utils/schemas.ts";

export async function userLevelResetAction(guildIdInput: string, userIdInput: string) {
	const guildId = parse(requiredSnowflake, guildIdInput);
	const userId = parse(requiredSnowflake, userIdInput);

	await api.delete(`levels/${guildId}/users/${userId}`);

	refresh();
}
