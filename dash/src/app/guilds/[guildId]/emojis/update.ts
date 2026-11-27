"use server";

import { saveSettings } from "@/app/guilds/[guildId]/settings.ts";
import type { SaveResult } from "@/lib/guild.ts";
import { schema } from "./schema.ts";

export async function update(guildId: string, _previousState: SaveResult | null, form: FormData) {
	return saveSettings(guildId, schema, form);
}
