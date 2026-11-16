"use server";

import { object } from "valibot";
import { saveSettings } from "@/app/guilds/[guildId]/settings.ts";
import type { SaveResult } from "@/lib/guild.ts";
import { snowflake, toggle } from "@/utils/schemas.ts";

const schema = object({
	emojiList: toggle,
	emojiListChannel: snowflake,
});

export async function update(guildId: string, premium: boolean, _previousState: SaveResult | null, form: FormData) {
	return saveSettings(guildId, premium, schema, form);
}
