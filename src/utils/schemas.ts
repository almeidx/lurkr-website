import {
	array,
	literal,
	maxLength,
	maxValue,
	minLength,
	minValue,
	number,
	optional,
	pipe,
	regex,
	string,
	transform,
	union,
} from "valibot";
import { MAX_VANITY_LENGTH, MIN_VANITY_LENGTH, VANITY_REGEX_SOURCE } from "@/lib/guild-config.ts";
import { Time } from "@/utils/time.ts";

export const SELECT_VALUE_SCHEMA = pipe(string(), regex(/^(\d{17,19},)*\d{17,19}$/));

export const UUID_REGEX = /\w{8}(?:-\w{4}){3}-\w{12}/;

export const SNOWFLAKE_REGEX_SCHEMA = regex(/^[1-9]\d{16,18}$/);

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

export const snowflake = union([emptyStringToNull, pipe(string(), SNOWFLAKE_REGEX_SCHEMA)]);

export const toggle = pipe(
	optional(
		union([
			literal("on"),
			literal("off"), // This value is actually never passed, but it needs to be here for valibot to allow the default value
		]),
		"off",
	),
	transform((value) => value === "on"),
);

export const booleanFlag = pipe(
	union([literal("true"), literal("false")]),
	transform((value) => value === "true"),
);

export function createMinuteIntervalValidator(min: number, max: number, _name: string) {
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

export function createSnowflakesValidator(max: number) {
	// 951586951348244561,951585785440788540,1094363099479408661,...

	return pipe(
		string(),
		// `"".split(",")` => `[""]`, hence the check
		transform((value) => (value ? value.split(",") : [])),
		array(pipe(string(), SNOWFLAKE_REGEX_SCHEMA)),
		maxLength(max),
	);
}
