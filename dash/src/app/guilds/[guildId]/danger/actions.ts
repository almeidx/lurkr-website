"use server";

import { updateTag } from "next/cache";
import { parse } from "valibot";
import { settingsTag } from "@/app/guilds/[guildId]/settings.ts";
import { api } from "@/lib/api.ts";
import { requiredSnowflake } from "@/utils/schemas.ts";

export async function resetGuildDataAction(guildIdInput: string) {
	const guildId = parse(requiredSnowflake, guildIdInput);

	await api.delete(`guilds/${guildId}`);

	updateTag(settingsTag(guildId));
}
