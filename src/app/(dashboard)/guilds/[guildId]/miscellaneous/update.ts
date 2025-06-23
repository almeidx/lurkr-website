"use server";

import { object, safeParse } from "valibot";
import { action } from "@/app/(dashboard)/guilds/[guildId]/action-base.ts";
import { MAX_AUTO_PUBLISH_CHANNELS, MAX_AUTO_PUBLISH_CHANNELS_PREMIUM } from "@/lib/guild-config.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { createSnowflakesValidator, toggle } from "@/utils/schemas.ts";
import { ServerActionError } from "@/utils/server-action-error.ts";

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const schema = premium ? premiumSchema() : regularSchema();

	const result = safeParse(schema, formDataToObject(data));

	if (!result.success) {
		return { error: ServerActionError.SchemaMismatch, issues: JSON.stringify(result.issues) };
	}

	return action(guildId, result.output, `settings:${guildId}:miscellaneous`, premium);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
			autoPublishChannels: createSnowflakesValidator(
				premium ? MAX_AUTO_PUBLISH_CHANNELS_PREMIUM : MAX_AUTO_PUBLISH_CHANNELS,
			),
			storeCounts: toggle,
		}),
	);
}
