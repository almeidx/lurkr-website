"use server";

import { action } from "@/app/guilds/[guildId]/action-base.ts";
import { MAX_AUTO_PUBLISH_CHANNELS, MAX_AUTO_PUBLISH_CHANNELS_PREMIUM } from "@/lib/guild-config.ts";
import type { GuildSettings } from "@/lib/guild.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { createSnowflakesValidator, toggle } from "@/utils/schemas.ts";
import { object, parse } from "valibot";

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

export async function update(guildId: string, premium: boolean, data: FormData) {
	const schema = premium ? premiumSchema() : regularSchema();
	const settings = parse(schema, formDataToObject(data)) satisfies Partial<GuildSettings>;

	await action(guildId, settings, `settings:${guildId}:miscellaneous`);
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
