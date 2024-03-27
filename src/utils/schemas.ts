import { Time } from "@/utils/time.ts";
import {
	type Pipe,
	array,
	coerce,
	literal,
	maxLength,
	maxValue,
	minValue,
	number,
	optional,
	regex,
	string,
	transform,
	union,
} from "valibot";

export const SELECT_VALUE_SCHEMA = string([regex(/^(\d{17,19},)*\d{17,19}$/)]);

export const UUID_REGEX = /\w{8}(?:-\w{4}){3}-\w{12}/;

export const SNOWFLAKE_SCHEMA = regex(/^[1-9]\d{16,18}$/);

export const snowflake = transform(union([literal(""), string([SNOWFLAKE_SCHEMA])]), (value) => value || null);

export const toggle = transform(optional(literal("on")), (value) => value === "on");

export const interval = coerce(number(), Number);

export const booleanFlag = transform(union([literal("true"), literal("false")]), (value) => value === "true");

export function createMinuteIntervalValidator(min: number, max: number, name: string, extras: Pipe<number> = []) {
	return coerce(
		number(`${name} must be a number`, [
			minValue(min * Time.Minutes, `${name} must be >= ${min}`),
			maxValue(max * Time.Minutes, `${name} must be <= ${max}`),
			...extras,
		]),
		(value) => {
			const val = Number.parseInt(value as any, 10);
			if (Number.isNaN(val)) throw new Error("Invalid number");

			return val * Time.Minutes;
		},
	);
}

export function createSnowflakesValidator(max: number) {
	// 951586951348244561,951585785440788540,1094363099479408661,...
	return coerce(array(string([SNOWFLAKE_SCHEMA]), [maxLength(max)]), (value) => {
		if (typeof value === "string") return value ? value.split(",") : [];
		throw new Error("Invalid snowflakes");
	});
}
