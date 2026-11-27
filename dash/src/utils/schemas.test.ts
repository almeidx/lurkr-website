import { object, safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { snowflakes } from "@/test/snowflakes.ts";
import {
	booleanFlag,
	coerceToFloat,
	coerceToInt,
	minuteInterval,
	snowflake,
	snowflakeList,
	toggle,
	vanitySchema,
} from "@/utils/schemas.ts";

const MINUTE = 60_000;

describe("toggle", () => {
	const form = object({ enabled: toggle });

	it("saves a checked box as true", () => {
		expect(safeParse(form, { enabled: "on" }).output).toEqual({ enabled: true });
	});

	it("saves an unchecked box, which the form leaves out, as false", () => {
		expect(safeParse(form, {}).output).toEqual({ enabled: false });
	});

	it("saves an explicit off as false", () => {
		expect(safeParse(form, { enabled: "off" }).output).toEqual({ enabled: false });
	});

	it.each(["true", "1", ""])("rejects %j", (value) => {
		expect(safeParse(form, { enabled: value }).success).toBe(false);
	});
});

describe("booleanFlag", () => {
	it("reads the radio values", () => {
		expect(safeParse(booleanFlag, "true").output).toBe(true);
		expect(safeParse(booleanFlag, "false").output).toBe(false);
	});

	it.each(["on", "", "TRUE"])("rejects %j", (value) => {
		expect(safeParse(booleanFlag, value).success).toBe(false);
	});

	it("rejects a missing value", () => {
		expect(safeParse(object({ flag: booleanFlag }), {}).success).toBe(false);
	});
});

describe("coerceToInt", () => {
	it.each([
		["42", 42],
		["0", 0],
		["-7", -7],
		[42, 42],
	])("reads %j as %i", (value, expected) => {
		expect(safeParse(coerceToInt, value).output).toBe(expected);
	});

	it.each(["abc", ""])("rejects %j", (value) => {
		expect(safeParse(coerceToInt, value).success).toBe(false);
	});
});

describe("coerceToFloat", () => {
	it.each([
		["1.5", 1.5],
		["2", 2],
		[0.25, 0.25],
	])("reads %j as %d", (value, expected) => {
		expect(safeParse(coerceToFloat, value).output).toBe(expected);
	});

	it.each(["abc", ""])("rejects %j", (value) => {
		expect(safeParse(coerceToFloat, value).success).toBe(false);
	});
});

describe("minuteInterval", () => {
	const interval = minuteInterval(1, 30);

	it('turns the setting off for "0"', () => {
		const result = safeParse(interval, "0");

		expect(result.success).toBe(true);
		expect(result.output).toBeNull();
	});

	it("converts minutes to milliseconds", () => {
		expect(safeParse(interval, "5").output).toBe(5 * MINUTE);
	});

	it("accepts both bounds", () => {
		expect(safeParse(interval, "1").output).toBe(MINUTE);
		expect(safeParse(interval, "30").output).toBe(30 * MINUTE);
	});

	it("rejects a value above the maximum", () => {
		expect(safeParse(interval, "31").success).toBe(false);
	});

	it("rejects a value below the minimum that is not the off value", () => {
		expect(safeParse(minuteInterval(5, 30), "4").success).toBe(false);
		expect(safeParse(interval, "-1").success).toBe(false);
	});

	it.each(["", "abc"])("rejects %j", (value) => {
		expect(safeParse(interval, value).success).toBe(false);
	});
});

describe("snowflake", () => {
	it("reads an empty selection as null", () => {
		const result = safeParse(snowflake, "");

		expect(result.success).toBe(true);
		expect(result.output).toBeNull();
	});

	it.each(["12345678901234567", "123456789012345678", "1234567890123456789"])("accepts the ID %s", (id) => {
		expect(safeParse(snowflake, id).output).toBe(id);
	});

	it.each([
		["too short", "1234567890123456"],
		["too long", "12345678901234567890"],
		["starting with a zero", "012345678901234567"],
		["with a letter", "12345678901234567a"],
		["with surrounding whitespace", " 123456789012345678"],
	])("rejects an ID %s", (_reason, id) => {
		expect(safeParse(snowflake, id).success).toBe(false);
	});
});

describe("snowflakeList", () => {
	const list = snowflakeList(3);

	it("reads an empty selection as an empty list", () => {
		expect(safeParse(list, "").output).toEqual([]);
	});

	it("reads a single ID", () => {
		expect(safeParse(list, "123456789012345678").output).toEqual(["123456789012345678"]);
	});

	it("splits comma-separated IDs, keeping their order", () => {
		expect(safeParse(list, "223456789012345678,123456789012345678").output).toEqual([
			"223456789012345678",
			"123456789012345678",
		]);
	});

	it("accepts as many IDs as the limit", () => {
		expect(safeParse(list, snowflakes(3).join(",")).success).toBe(true);
	});

	it("rejects more IDs than the limit", () => {
		expect(safeParse(list, snowflakes(4).join(",")).success).toBe(false);
	});

	it("rejects a list with an entry that is not an ID", () => {
		expect(safeParse(list, "123456789012345678,everyone").success).toBe(false);
	});
});

describe("vanitySchema", () => {
	it.each(["ab", "lurkr", "server123", "a".repeat(32)])("accepts %s", (vanity) => {
		expect(safeParse(vanitySchema, vanity).output).toBe(vanity);
	});

	it.each([
		["shorter than 2 characters", "a"],
		["longer than 32 characters", "a".repeat(33)],
		["with uppercase letters", "Lurkr"],
		["with a hyphen", "my-server"],
		["with a space", "my server"],
		["with a slash", "a/b"],
	])("rejects a vanity %s", (_reason, vanity) => {
		expect(safeParse(vanitySchema, vanity).success).toBe(false);
	});
});
