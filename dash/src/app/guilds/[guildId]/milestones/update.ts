"use server";

import { maxLength, maxValue, minLength, minValue, multipleOf, object, pipe, string, union } from "valibot";
import { saveSettings } from "@/app/guilds/[guildId]/settings.ts";
import {
	limitFor,
	MAX_MILESTONES_INTERVAL,
	MAX_MILESTONES_MESSAGE_LENGTH,
	MILESTONES_INTERVAL_MULTIPLE_OF,
	MIN_MILESTONES_INTERVAL,
	MIN_MILESTONES_MESSAGE_LENGTH,
} from "@/lib/guild-config.ts";
import type { SaveResult } from "@/lib/guild.ts";
import { coerceToInt, emptyStringToNull, snowflake, snowflakeList, toggle } from "@/utils/schemas.ts";

function schema(premium: boolean) {
	return object({
		milestonesChannel: snowflake,
		milestonesInterval: pipe(
			coerceToInt,
			minValue(MIN_MILESTONES_INTERVAL),
			maxValue(MAX_MILESTONES_INTERVAL),
			multipleOf(MILESTONES_INTERVAL_MULTIPLE_OF),
		),
		milestonesMessage: union([
			emptyStringToNull,
			pipe(string(), minLength(MIN_MILESTONES_MESSAGE_LENGTH), maxLength(MAX_MILESTONES_MESSAGE_LENGTH)),
		]),
		milestonesRoles: snowflakeList(limitFor("milestonesRoles", premium)),
		storeMilestones: toggle,
	});
}

export async function update(guildId: string, premium: boolean, _previousState: SaveResult | null, form: FormData) {
	return saveSettings(guildId, premium, schema(premium), form);
}
