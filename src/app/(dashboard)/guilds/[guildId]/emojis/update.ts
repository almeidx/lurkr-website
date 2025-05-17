"use server";

import { action } from "@/app/(dashboard)/guilds/[guildId]/action-base.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { snowflake, toggle } from "@/utils/schemas.ts";
import { ServerActionError } from "@/utils/server-action-error.ts";
import { object, safeParse } from "valibot";

const schema = object({
	emojiList: toggle,
	emojiListChannel: snowflake,
});

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const result = safeParse(schema, formDataToObject(data));

	if (!result.success) {
		return { error: ServerActionError.SchemaMismatch, issues: JSON.stringify(result.issues) };
	}

	return action(guildId, result.output, `settings:${guildId}:emojis`, premium);
}
