import { maxLength, maxValue, minLength, minValue, multipleOf, object, pipe, string, union } from "valibot";
import {
	limitFor,
	MAX_MILESTONES_INTERVAL,
	MAX_MILESTONES_MESSAGE_LENGTH,
	MILESTONES_INTERVAL_MULTIPLE_OF,
	MIN_MILESTONES_INTERVAL,
	MIN_MILESTONES_MESSAGE_LENGTH,
} from "@/lib/guild-config.ts";
import { coerceToInt, emptyStringToNull, snowflake, snowflakeList, toggle } from "@/utils/schemas.ts";

export function schema(premium: boolean) {
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
