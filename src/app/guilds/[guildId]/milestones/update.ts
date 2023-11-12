"use server";

import { action } from "@/app/guilds/[guildId]/action-base.ts";
import {
	MAX_MILESTONES_INTERVAL,
	MAX_MILESTONES_MESSAGE_LENGTH,
	MAX_MILESTONES_ROLES,
	MAX_MILESTONES_ROLES_PREMIUM,
	MILESTONES_INTERVAL_MULTIPLE_OF,
	MIN_MILESTONES_INTERVAL,
} from "@/lib/guild-config.ts";
import type { GuildSettings } from "@/lib/guild.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { createSnowflakesValidator, snowflake, toggle } from "@/utils/schemas.ts";
import { coerce, maxLength, maxValue, minValue, multipleOf, number, object, parse, string } from "valibot";

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

export async function update(guildId: string, premium: boolean, data: FormData) {
	const schema = premium ? premiumSchema() : regularSchema();

	const settings = parse(schema, formDataToObject(data)) satisfies Partial<GuildSettings>;

	await action(guildId, settings, `settings:${guildId}:milestones`);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
			milestonesChannel: snowflake,
			milestonesInterval: coerce(
				number("Milestones interval must be a number", [
					minValue(MIN_MILESTONES_INTERVAL, "Milestones interval is too short"),
					maxValue(MAX_MILESTONES_INTERVAL, "Milestones interval is too long"),
					multipleOf(MILESTONES_INTERVAL_MULTIPLE_OF, "Milestones interval must be a multiple of 5"),
				]),
				// @ts-expect-error: Overly strict type
				Number.parseInt,
			),
			milestonesMessage: string("Milestones message must be a string", [
				maxLength(MAX_MILESTONES_MESSAGE_LENGTH, "Milestones message is too long"),
			]),
			milestonesRoles: createSnowflakesValidator(premium ? MAX_MILESTONES_ROLES_PREMIUM : MAX_MILESTONES_ROLES),
			storeMilestones: toggle,
		}),
	);
}
