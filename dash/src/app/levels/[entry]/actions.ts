"use server";

import { isHTTPError } from "ky";
import { refresh } from "next/cache";
import { parse } from "valibot";
import { api } from "@/lib/api.ts";
import type { ActionResult } from "@/lib/guild.ts";
import { requiredSnowflake } from "@/utils/schemas.ts";

export async function userLevelResetAction(guildIdInput: string, userIdInput: string): Promise<ActionResult> {
	const guildId = parse(requiredSnowflake, guildIdInput);
	const userId = parse(requiredSnowflake, userIdInput);

	try {
		await api.delete(`levels/${guildId}/users/${userId}`);

		refresh();

		return { ok: true };
	} catch (error) {
		if (!isHTTPError(error)) {
			throw error;
		}

		console.error(`Failed to reset user ${userId} level in guild ${guildId}:`, error.data);
		return { error: error.message, ok: false };
	}
}
