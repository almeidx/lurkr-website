import { MAX_VANITY_LENGTH, MIN_VANITY_LENGTH, VANITY_REGEX_SOURCE } from "@/lib/guild-config.ts";
import { Time } from "@/utils/time.ts";
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

export const SELECT_VALUE_SCHEMA = pipe(string(), regex(/^(\d{17,19},)*\d{17,19}$/));

export const UUID_REGEX = /\w{8}(?:-\w{4}){3}-\w{12}/;

export const SNOWFLAKE_REGEX_SCHEMA = regex(/^[1-9]\d{16,18}$/);

export const vanitySchema = pipe(
	string(),
	minLength(MIN_VANITY_LENGTH),
	maxLength(MAX_VANITY_LENGTH),
	regex(new RegExp(VANITY_REGEX_SOURCE)),
);

export const snowflake = pipe(
	union([literal(""), pipe(string(), SNOWFLAKE_REGEX_SCHEMA)]),
	transform((value) => value || null),
);

export const toggle = pipe(
	optional(literal("on")),
	transform((value) => value === "on"),
);

export const booleanFlag = pipe(
	union([literal("true"), literal("false")]),
	transform((value) => value === "true"),
);

export function createMinuteIntervalValidator(min: number, max: number, name: string) {
	return pipe(
		union([number(), string()]),
		transform((value) => {
			if (typeof value === "number") return value;

			const val = Number.parseInt(value, 10);
			if (Number.isNaN(val)) throw new Error("Invalid number");

			return val * Time.Minutes;
		}),
		number(`${name} must be a number`),
		minValue(min * Time.Minutes, `${name} must be >= ${min}`),
		maxValue(max * Time.Minutes, `${name} must be <= ${max}`),
	);
}

export function createSnowflakesValidator(max: number) {
	// 951586951348244561,951585785440788540,1094363099479408661,...

	return pipe(
		string(),
		transform((value) => {
			// `"".split(",")` => `[""]`, hence the check
			return value ? value.split(",") : [];
		}),
		array(pipe(string(), SNOWFLAKE_REGEX_SCHEMA)),
		maxLength(max),
	);
}
