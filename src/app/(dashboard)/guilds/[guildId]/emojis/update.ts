"use server";

import { action } from "@/app/(dashboard)/guilds/[guildId]/action-base.ts";
import type { GuildSettings } from "@/lib/guild.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { snowflake, toggle } from "@/utils/schemas.ts";
import { object, parse } from "valibot";

const schema = object({
	emojiList: toggle,
	emojiListChannel: snowflake,
});

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const settings = parse(schema, formDataToObject(data)) satisfies Partial<GuildSettings>;

	return action(guildId, settings, `settings:${guildId}:emojis`, premium);
}
