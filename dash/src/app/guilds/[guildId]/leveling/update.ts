"use server";

import { saveSettings } from "@/app/guilds/[guildId]/settings.ts";
import type { SaveResult } from "@/lib/guild.ts";
import { schema } from "./schema.ts";

export async function update(
	guildId: string,
	premium: boolean,
	_previousState: SaveResult | null,
	form: FormData,
): Promise<SaveResult> {
	return saveSettings(guildId, schema(premium), form);
}
