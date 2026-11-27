"use server";

import { isHTTPError } from "ky";
import { updateTag } from "next/cache";
import { parse } from "valibot";
import { settingsTag } from "@/app/guilds/[guildId]/settings.ts";
import { api } from "@/lib/api.ts";
import type { ActionResult } from "@/lib/guild.ts";
import { requiredSnowflake } from "@/utils/schemas.ts";

export async function resetGuildDataAction(guildIdInput: string): Promise<ActionResult> {
	const guildId = parse(requiredSnowflake, guildIdInput);

	try {
		await api.delete(`guilds/${guildId}`);

		updateTag(settingsTag(guildId));

		return { ok: true };
	} catch (error) {
		if (!isHTTPError(error)) {
			throw error;
		}

		console.error(`Failed to reset guild ${guildId} data:`, error.data);
		return { error: error.message, ok: false };
	}
}
