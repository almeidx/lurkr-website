import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { snowflakes } from "@/test/snowflakes.ts";
import { schema } from "./schema.ts";

const roleMultiplier = { id: "a1", multiplier: 1.5, targets: ["123456789012345678"], type: "Role" };
const channelMultiplier = { id: "b2", multiplier: 0.5, targets: ["223456789012345678"], type: "Channel" };

const form = {
	prioritiseMultiplierRoleHierarchy: "true",
	voteBoostedXp: "on",
	xpGlobalMultiplier: "1.25",
	xpMultipliers: JSON.stringify([roleMultiplier, channelMultiplier]),
};

function parse(overrides: Record<string, string>, premium = false) {
	return safeParse(schema(premium), { ...form, ...overrides });
}

function multipliers(count: number) {
	return JSON.stringify(Array.from({ length: count }, (_, index) => ({ ...roleMultiplier, id: `id-${index}` })));
}

describe("multipliers schema", () => {
	it("parses a submitted form", () => {
		expect(safeParse(schema(false), form).output).toEqual({
			prioritiseMultiplierRoleHierarchy: true,
			voteBoostedXp: true,
			xpGlobalMultiplier: 1.25,
			xpMultipliers: [roleMultiplier, channelMultiplier],
		});
	});

	it("parses a form with no multipliers and the toggles off", () => {
		const result = safeParse(schema(false), {
			prioritiseMultiplierRoleHierarchy: "false",
			xpGlobalMultiplier: "1",
			xpMultipliers: "[]",
		});

		expect(result.output).toEqual({
			prioritiseMultiplierRoleHierarchy: false,
			voteBoostedXp: false,
			xpGlobalMultiplier: 1,
			xpMultipliers: [],
		});
	});

	it("accepts a global multiplier of 0.01 to 5", () => {
		expect(parse({ xpGlobalMultiplier: "0.01" }).success).toBe(true);
		expect(parse({ xpGlobalMultiplier: "5" }).success).toBe(true);
	});

	it.each(["0", "0.009", "5.01", "-1", ""])("rejects a global multiplier of %j", (xpGlobalMultiplier) => {
		expect(parse({ xpGlobalMultiplier }).success).toBe(false);
	});

	it.each([0, 0.009, 5.01])("rejects a target multiplier of %d", (multiplier) => {
		expect(parse({ xpMultipliers: JSON.stringify([{ ...roleMultiplier, multiplier }]) }).success).toBe(false);
	});

	it("rejects a multiplier for something other than a role or channel", () => {
		expect(parse({ xpMultipliers: JSON.stringify([{ ...roleMultiplier, type: "User" }]) }).success).toBe(false);
	});

	it("rejects a multiplier whose target is not an ID", () => {
		expect(parse({ xpMultipliers: JSON.stringify([{ ...roleMultiplier, targets: ["everyone"] }]) }).success).toBe(
			false,
		);
	});

	it("reports malformed multiplier JSON as a validation failure", () => {
		expect(parse({ xpMultipliers: "[{" }).success).toBe(false);
	});

	it("limits a regular server to 5 multipliers", () => {
		expect(parse({ xpMultipliers: multipliers(5) }).success).toBe(true);
		expect(parse({ xpMultipliers: multipliers(6) }).success).toBe(false);
	});

	it("limits a premium server to 25 multipliers", () => {
		expect(parse({ xpMultipliers: multipliers(25) }, true).success).toBe(true);
		expect(parse({ xpMultipliers: multipliers(26) }, true).success).toBe(false);
	});

	it("limits a regular server to 30 targets per multiplier", () => {
		const withTargets = (count: number) => JSON.stringify([{ ...roleMultiplier, targets: snowflakes(count) }]);

		expect(parse({ xpMultipliers: withTargets(30) }).success).toBe(true);
		expect(parse({ xpMultipliers: withTargets(31) }).success).toBe(false);
	});

	it("limits a premium server to 50 targets per multiplier", () => {
		const withTargets = (count: number) => JSON.stringify([{ ...roleMultiplier, targets: snowflakes(count) }]);

		expect(parse({ xpMultipliers: withTargets(50) }, true).success).toBe(true);
		expect(parse({ xpMultipliers: withTargets(51) }, true).success).toBe(false);
	});
});
