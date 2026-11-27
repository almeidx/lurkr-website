import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { snowflakes } from "@/test/snowflakes.ts";
import { UserFlags } from "@/utils/user-flags.ts";
import { schema } from "./schema.ts";

const MINUTE = 60_000;

const badgeRole = { flagId: UserFlags.ActiveDeveloper, id: "a1", roleIds: ["323456789012345678"] };

const form = {
	autoRole: "123456789012345678,223456789012345678",
	autoRoleFlags: JSON.stringify([badgeRole]),
	autoRoleTimeout: "10",
	mentionCooldown: "30",
	mentionCooldownRoles: "423456789012345678",
};

function parse(overrides: Record<string, string>, premium = false) {
	return safeParse(schema(premium), { ...form, ...overrides });
}

describe("roles schema", () => {
	it("parses a submitted form, converting the intervals to milliseconds", () => {
		expect(safeParse(schema(false), form).output).toEqual({
			autoRole: ["123456789012345678", "223456789012345678"],
			autoRoleFlags: [badgeRole],
			autoRoleTimeout: 10 * MINUTE,
			mentionCooldown: 30 * MINUTE,
			mentionCooldownRoles: ["423456789012345678"],
		});
	});

	it("parses a form with everything turned off", () => {
		const result = safeParse(schema(false), {
			autoRole: "",
			autoRoleFlags: "[]",
			autoRoleTimeout: "0",
			mentionCooldown: "0",
			mentionCooldownRoles: "",
		});

		expect(result.output).toEqual({
			autoRole: [],
			autoRoleFlags: [],
			autoRoleTimeout: null,
			mentionCooldown: null,
			mentionCooldownRoles: [],
		});
	});

	it("accepts an on join delay of 1 to 30 minutes", () => {
		expect(parse({ autoRoleTimeout: "1" }).success).toBe(true);
		expect(parse({ autoRoleTimeout: "30" }).success).toBe(true);
		expect(parse({ autoRoleTimeout: "31" }).success).toBe(false);
	});

	it("limits a regular server to a 6 hour mention cooldown", () => {
		expect(parse({ mentionCooldown: "360" }).output).toHaveProperty("mentionCooldown", 360 * MINUTE);
		expect(parse({ mentionCooldown: "361" }).success).toBe(false);
	});

	it("limits a premium server to a 24 hour mention cooldown", () => {
		expect(parse({ mentionCooldown: "1440" }, true).output).toHaveProperty("mentionCooldown", 1440 * MINUTE);
		expect(parse({ mentionCooldown: "1441" }, true).success).toBe(false);
	});

	it("limits a regular server to 5 on join roles", () => {
		expect(parse({ autoRole: snowflakes(5).join(",") }).success).toBe(true);
		expect(parse({ autoRole: snowflakes(6).join(",") }).success).toBe(false);
	});

	it("limits a premium server to 25 on join roles", () => {
		expect(parse({ autoRole: snowflakes(25).join(",") }, true).success).toBe(true);
		expect(parse({ autoRole: snowflakes(26).join(",") }, true).success).toBe(false);
	});

	it("limits the mention cooldown to 25 roles", () => {
		expect(parse({ mentionCooldownRoles: snowflakes(25).join(",") }, true).success).toBe(true);
		expect(parse({ mentionCooldownRoles: snowflakes(26).join(",") }, true).success).toBe(false);
	});

	it("rejects a badge that does not exist", () => {
		expect(parse({ autoRoleFlags: JSON.stringify([{ ...badgeRole, flagId: 3 }]) }).success).toBe(false);
		expect(parse({ autoRoleFlags: JSON.stringify([{ ...badgeRole, flagId: "Staff" }]) }).success).toBe(false);
	});

	it("limits a badge to 5 roles", () => {
		const withRoles = (count: number) => JSON.stringify([{ ...badgeRole, roleIds: snowflakes(count) }]);

		expect(parse({ autoRoleFlags: withRoles(5) }).success).toBe(true);
		expect(parse({ autoRoleFlags: withRoles(6) }).success).toBe(false);
	});

	it("limits the on join roles for badges to 5 entries", () => {
		const entries = (count: number) =>
			JSON.stringify(Array.from({ length: count }, (_, index) => ({ ...badgeRole, id: `id-${index}` })));

		expect(parse({ autoRoleFlags: entries(5) }).success).toBe(true);
		expect(parse({ autoRoleFlags: entries(6) }).success).toBe(false);
	});

	it("reports malformed badge JSON as a validation failure", () => {
		expect(parse({ autoRoleFlags: "not json" }).success).toBe(false);
	});
});
