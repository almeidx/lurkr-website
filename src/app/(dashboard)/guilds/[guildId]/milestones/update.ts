"use server";

import { action } from "@/app/(dashboard)/guilds/[guildId]/action-base.ts";
import {
	MAX_MILESTONES_INTERVAL,
	MAX_MILESTONES_MESSAGE_LENGTH,
	MAX_MILESTONES_ROLES,
	MAX_MILESTONES_ROLES_PREMIUM,
	MILESTONES_INTERVAL_MULTIPLE_OF,
	MIN_MILESTONES_INTERVAL,
	MIN_MILESTONES_MESSAGE_LENGTH,
} from "@/lib/guild-config.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { coerceToInt, createSnowflakesValidator, emptyStringToNull, snowflake, toggle } from "@/utils/schemas.ts";
import { ServerActionError } from "@/utils/server-action-error.ts";
import { maxLength, maxValue, minLength, minValue, multipleOf, object, pipe, safeParse, string, union } from "valibot";

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const schema = premium ? premiumSchema() : regularSchema();

	const result = safeParse(schema, formDataToObject(data));

	if (!result.success) {
		return { error: ServerActionError.SchemaMismatch, issues: JSON.stringify(result.issues) };
	}

	return action(guildId, result.output, `settings:${guildId}:milestones`, premium);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
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
			milestonesRoles: createSnowflakesValidator(premium ? MAX_MILESTONES_ROLES_PREMIUM : MAX_MILESTONES_ROLES),
			storeMilestones: toggle,
		}),
	);
}
