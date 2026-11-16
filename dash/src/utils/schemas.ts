import {
	array,
	literal,
	maxLength,
	maxValue,
	minLength,
	minValue,
	number,
	optional,
	picklist,
	pipe,
	regex,
	string,
	transform,
	union,
} from "valibot";
import { MAX_VANITY_LENGTH, MIN_VANITY_LENGTH, VANITY_REGEX_SOURCE } from "@/lib/guild-config.ts";
import { SNOWFLAKE_REGEX } from "@/utils/is-snowflake.ts";
import { Time } from "@/utils/time.ts";

export const vanitySchema = pipe(
	string(),
	minLength(MIN_VANITY_LENGTH),
	maxLength(MAX_VANITY_LENGTH),
	regex(new RegExp(VANITY_REGEX_SOURCE)),
);

export const emptyStringToNull = pipe(
	literal(""),
	transform(() => null),
);

export const coerceToInt = pipe(
	union([number(), string()]),
	transform((value) => (typeof value === "number" ? value : Number.parseInt(value, 10))),
	number(),
);
export const coerceToFloat = pipe(
	union([number(), string()]),
	transform((value) => (typeof value === "number" ? value : Number.parseFloat(value))),
	number(),
);

export const requiredSnowflake = pipe(string(), regex(SNOWFLAKE_REGEX));
export const snowflake = union([emptyStringToNull, requiredSnowflake]);

/**
 * A checkbox submits `"on"` when checked and is left out of the form otherwise. `object()` drops a missing key unless
 * its schema has a default, so the `"off"` default is what makes an unchecked box save `false`.
 */
export const toggle = pipe(
	optional(picklist(["on", "off"]), "off"),
	transform((value) => value === "on"),
);

export const booleanFlag = pipe(
	union([literal("true"), literal("false")]),
	transform((value) => value === "true"),
);

/** Minutes, where `"0"` turns the setting off. Outputs milliseconds. */
export function minuteInterval(min: number, max: number) {
	return union([
		pipe(
			literal("0"),
			transform(() => null),
		),
		pipe(
			coerceToInt,
			transform((value) => value * Time.Minutes),
			minValue(min * Time.Minutes),
			maxValue(max * Time.Minutes),
		),
	]);
}

/** Comma-separated snowflakes, as submitted by the channel and role selectors. */
export function snowflakeList(max: number) {
	return pipe(
		string(),
		// `"".split(",")` is `[""]`
		transform((value) => (value ? value.split(",") : [])),
		array(requiredSnowflake),
		maxLength(max),
	);
}
