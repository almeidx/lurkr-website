"use server";

import { object } from "valibot";
import { saveSettings } from "@/app/guilds/[guildId]/settings.ts";
import { limitFor } from "@/lib/guild-config.ts";
import type { SaveResult } from "@/lib/guild.ts";
import { snowflakeList, toggle } from "@/utils/schemas.ts";

function schema(premium: boolean) {
	return object({
		autoPublishChannels: snowflakeList(limitFor("autoPublishChannels", premium)),
		storeCounts: toggle,
	});
}

export async function update(guildId: string, premium: boolean, _previousState: SaveResult | null, form: FormData) {
	return saveSettings(guildId, premium, schema(premium), form);
}
