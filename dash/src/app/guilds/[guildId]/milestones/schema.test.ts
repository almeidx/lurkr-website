import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { snowflakes } from "@/test/snowflakes.ts";
import { schema } from "./schema.ts";

const form = {
	milestonesChannel: "123456789012345678",
	milestonesInterval: "500",
	milestonesMessage: "Welcome {user}, you are member {milestone}!",
	milestonesRoles: "223456789012345678,323456789012345678",
	storeMilestones: "on",
};

function parse(overrides: Record<string, string>, premium = false) {
	return safeParse(schema(premium), { ...form, ...overrides });
}

describe("milestones schema", () => {
	it("parses a submitted form", () => {
		expect(safeParse(schema(false), form).output).toEqual({
			milestonesChannel: "123456789012345678",
			milestonesInterval: 500,
			milestonesMessage: "Welcome {user}, you are member {milestone}!",
			milestonesRoles: ["223456789012345678", "323456789012345678"],
			storeMilestones: true,
		});
	});

	it("parses a form with the optional settings left empty", () => {
		const result = safeParse(schema(false), {
			milestonesChannel: "",
			milestonesInterval: "100",
			milestonesMessage: "",
			milestonesRoles: "",
		});

		expect(result.output).toEqual({
			milestonesChannel: null,
			milestonesInterval: 100,
			milestonesMessage: null,
			milestonesRoles: [],
			storeMilestones: false,
		});
	});

	it.each(["100", "105", "100000"])("accepts an interval of %s", (milestonesInterval) => {
		expect(parse({ milestonesInterval }).success).toBe(true);
	});

	it.each([
		["below the minimum", "95"],
		["above the maximum", "100005"],
		["that is not a multiple of 5", "102"],
		["that is empty", ""],
	])("rejects an interval %s", (_reason, milestonesInterval) => {
		expect(parse({ milestonesInterval }).success).toBe(false);
	});

	it("accepts a message of 10 to 1800 characters", () => {
		expect(parse({ milestonesMessage: "a".repeat(10) }).success).toBe(true);
		expect(parse({ milestonesMessage: "a".repeat(1800) }).success).toBe(true);
	});

	it("rejects a message outside 10 to 1800 characters", () => {
		expect(parse({ milestonesMessage: "a".repeat(9) }).success).toBe(false);
		expect(parse({ milestonesMessage: "a".repeat(1801) }).success).toBe(false);
	});

	it("limits a regular server to 5 milestone roles", () => {
		expect(parse({ milestonesRoles: snowflakes(5).join(",") }).success).toBe(true);
		expect(parse({ milestonesRoles: snowflakes(6).join(",") }).success).toBe(false);
	});

	it("limits a premium server to 10 milestone roles", () => {
		expect(parse({ milestonesRoles: snowflakes(10).join(",") }, true).success).toBe(true);
		expect(parse({ milestonesRoles: snowflakes(11).join(",") }, true).success).toBe(false);
	});
});
