import { getDotPath, safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { XP_CURVE_PRESETS } from "@/lib/guild-config.ts";
import { snowflakes } from "@/test/snowflakes.ts";
import { schema } from "./schema.ts";

const embed = {
	author: { icon_url: "https://example.com/icon.png", name: "Lurkr", url: "https://lurkr.gg" },
	color: 0xff7077,
	description: "{user} reached level {level}",
	fields: [{ inline: true, name: "Level", value: "{level}" }],
	footer: { text: "Keep chatting" },
	image: { url: "https://example.com/banner.png" },
	thumbnail: { url: "https://example.com/thumbnail.png" },
	title: "Level up!",
	url: "https://lurkr.gg/levels",
};

const roleReward = { id: "a1", level: 5, roleIds: ["423456789012345678"], stack: true };

/** What the browser submits: unchecked toggles are left out. */
const form = {
	accentColour: "#ff7077",
	autoResetLevelsLeave: "on",
	leaderboardVisibility: "Public",
	levels: "on",
	noRoleRewardRoles: "",
	noTopXpRoles: "",
	noXpRoles: "523456789012345678",
	topXpRole: "623456789012345678",
	vanity: "lurkr",
	xpAnnounceChannel: "123456789012345678",
	xpAnnounceChannelType: "Custom",
	xpAnnounceLevels: '["5","10"]',
	xpAnnounceMinimumLevel: "3",
	xpAnnounceMultipleOf: "5",
	xpChannelMode: "Blacklist",
	xpChannels: "223456789012345678,323456789012345678",
	xpCurve: "[150,-100,50]",
	xpDisallowedPrefixes: '["!","?"]',
	xpGainInterval: "60000",
	xpInThreads: "on",
	xpMessage: "{user} has reached level **{level}**",
	xpMessageEmbed: JSON.stringify(embed),
	xpPerMessageMax: "40",
	xpPerMessageMin: "15",
	xpRoleRewards: JSON.stringify([roleReward]),
};

function parse(overrides: Record<string, string>, premium = false) {
	return safeParse(schema(premium), { ...form, ...overrides });
}

/** The issues as the settings form reports them. */
function issues(overrides: Record<string, string>) {
	return parse(overrides).issues?.map((issue) => ({ message: issue.message, path: getDotPath(issue) }));
}

function withEmbed(patch: Record<string, unknown>) {
	return parse({ xpMessageEmbed: JSON.stringify({ ...embed, ...patch }) });
}

function withRoleReward(patch: Record<string, unknown>, premium = false) {
	return parse({ xpRoleRewards: JSON.stringify([{ ...roleReward, ...patch }]) }, premium);
}

describe("leveling schema", () => {
	it("parses a submitted form", () => {
		expect(safeParse(schema(false), form).output).toEqual({
			accentColour: "#ff7077",
			autoResetLevels: "Leave",
			leaderboardVisibility: "Public",
			levels: true,
			noRoleRewardRoles: [],
			noTopXpRoles: [],
			noXpRoles: ["523456789012345678"],
			syncRoleRewardsOnJoin: false,
			topXpRole: "623456789012345678",
			vanity: "lurkr",
			xpAnnounceChannel: "123456789012345678",
			xpAnnounceChannelType: "Custom",
			xpAnnounceLevels: [5, 10],
			xpAnnounceMinimumLevel: 3,
			xpAnnounceMultipleOf: 5,
			xpAnnounceOnlyXpRoles: false,
			xpChannelMode: "Blacklist",
			xpChannels: ["223456789012345678", "323456789012345678"],
			xpCurve: [150, -100, 50],
			xpDisallowedPrefixes: ["!", "?"],
			xpFromCommands: false,
			xpGainInterval: 60_000,
			xpInThreads: true,
			xpMessage: "{user} has reached level **{level}**",
			xpMessageEmbed: embed,
			xpPerMessageMax: 40,
			xpPerMessageMin: 15,
			xpRoleRewards: [roleReward],
		});
	});

	it("parses a form with every optional setting cleared", () => {
		const result = safeParse(schema(false), {
			leaderboardVisibility: "ManagersOnly",
			noRoleRewardRoles: "",
			noTopXpRoles: "",
			noXpRoles: "",
			topXpRole: "",
			vanity: "",
			xpAnnounceChannel: "",
			xpAnnounceChannelType: "None",
			xpAnnounceLevels: "[]",
			xpAnnounceMinimumLevel: "",
			xpAnnounceMultipleOf: "",
			xpChannelMode: "Whitelist",
			xpChannels: "",
			xpCurve: "[150,-100,50]",
			xpDisallowedPrefixes: "[]",
			xpGainInterval: "10000",
			xpMessage: "",
			xpMessageEmbed: "{}",
			xpPerMessageMax: "1",
			xpPerMessageMin: "1",
			xpRoleRewards: "[]",
		});

		expect(result.output).toEqual({
			autoResetLevels: "None",
			leaderboardVisibility: "ManagersOnly",
			levels: false,
			noRoleRewardRoles: [],
			noTopXpRoles: [],
			noXpRoles: [],
			syncRoleRewardsOnJoin: false,
			topXpRole: null,
			vanity: null,
			xpAnnounceChannel: null,
			xpAnnounceChannelType: "None",
			xpAnnounceLevels: [],
			xpAnnounceMinimumLevel: 0,
			xpAnnounceMultipleOf: null,
			xpAnnounceOnlyXpRoles: false,
			xpChannelMode: "Whitelist",
			xpChannels: [],
			xpCurve: [150, -100, 50],
			xpDisallowedPrefixes: [],
			xpFromCommands: false,
			xpGainInterval: 10_000,
			xpInThreads: false,
			xpMessage: null,
			xpMessageEmbed: null,
			xpPerMessageMax: 1,
			xpPerMessageMin: 1,
			xpRoleRewards: [],
		});
	});

	describe("automatic level reset", () => {
		const { autoResetLevelsLeave: _leave, ...withoutResets } = form;

		it.each([
			[{}, "None"],
			[{ autoResetLevelsLeave: "on" }, "Leave"],
			[{ autoResetLevelsBan: "on" }, "Ban"],
			[{ autoResetLevelsBan: "on", autoResetLevelsLeave: "on" }, "BanAndLeave"],
		])("combines the toggles %j into %s", (toggles, autoResetLevels) => {
			const result = safeParse(schema(false), { ...withoutResets, ...toggles });

			expect(result.output).toMatchObject({ autoResetLevels });
			expect(result.output).not.toHaveProperty("autoResetLevelsBan");
			expect(result.output).not.toHaveProperty("autoResetLevelsLeave");
		});
	});

	describe("XP per message", () => {
		it("accepts the same minimum and maximum", () => {
			expect(parse({ xpPerMessageMax: "25", xpPerMessageMin: "25" }).success).toBe(true);
		});

		it("rejects a minimum above the maximum, reporting it on the minimum", () => {
			expect(issues({ xpPerMessageMax: "15", xpPerMessageMin: "16" })).toEqual([
				{
					message: "Minimum XP per message must be less than or equal to maximum XP per message",
					path: "xpPerMessageMin",
				},
			]);
		});

		it("accepts the range 1 to 1000", () => {
			expect(parse({ xpPerMessageMax: "1000", xpPerMessageMin: "1" }).success).toBe(true);
		});

		it("rejects values outside 1 to 1000", () => {
			expect(parse({ xpPerMessageMin: "0" }).success).toBe(false);
			expect(parse({ xpPerMessageMax: "1001" }).success).toBe(false);
		});
	});

	describe("XP gain cooldown", () => {
		it("accepts 10 seconds to 24 hours", () => {
			expect(parse({ xpGainInterval: "10000" }).success).toBe(true);
			expect(parse({ xpGainInterval: "86400000" }).success).toBe(true);
		});

		it("rejects values outside 10 seconds to 24 hours", () => {
			expect(parse({ xpGainInterval: "9999" }).success).toBe(false);
			expect(parse({ xpGainInterval: "86400001" }).success).toBe(false);
		});
	});

	describe("XP curve", () => {
		it("accepts a curve with fractional coefficients", () => {
			const result = parse({ xpCurve: JSON.stringify(XP_CURVE_PRESETS.mee6) });

			expect(result.output).toHaveProperty("xpCurve", XP_CURVE_PRESETS.mee6);
		});

		it("rejects an unusable curve with the reason it cannot be used", () => {
			expect(issues({ xpCurve: "[0,0]" })).toEqual([
				{
					message: "All coefficients cannot be zero. At least one non-zero coefficient is required.",
					path: "xpCurve",
				},
			]);
		});

		it.each([
			["with too few coefficients", "[100]"],
			["that decreases", "[1000,-1]"],
			["with a coefficient that is not a number", '[0,"100"]'],
			["that is not a list", '{"0":100}'],
			["that is not JSON", "150,-100,50"],
		])("rejects a curve %s", (_reason, xpCurve) => {
			expect(parse({ xpCurve }).success).toBe(false);
		});
	});

	describe("level up message", () => {
		it("requires a channel when announcing in a custom channel", () => {
			expect(issues({ xpAnnounceChannel: "", xpAnnounceChannelType: "Custom" })).toEqual([
				{ message: "Missing Level Up Message Announcement channel", path: "xpAnnounceChannel" },
			]);
		});

		it.each(["Direct", "None", "SameChannel"])("needs no channel when announcing with %s", (xpAnnounceChannelType) => {
			expect(parse({ xpAnnounceChannel: "", xpAnnounceChannelType }).success).toBe(true);
		});

		it("rejects an unknown announcement type", () => {
			expect(parse({ xpAnnounceChannelType: "Everywhere" }).success).toBe(false);
		});

		it("accepts a message of 10 to 1800 characters", () => {
			expect(parse({ xpMessage: "a".repeat(10) }).success).toBe(true);
			expect(parse({ xpMessage: "a".repeat(1800) }).success).toBe(true);
		});

		it("rejects a message outside 10 to 1800 characters", () => {
			expect(parse({ xpMessage: "a".repeat(9) }).success).toBe(false);
			expect(parse({ xpMessage: "a".repeat(1801) }).success).toBe(false);
		});
	});

	describe("level up message conditions", () => {
		it("accepts announce levels submitted as numbers", () => {
			expect(parse({ xpAnnounceLevels: "[1,100]" }).output).toHaveProperty("xpAnnounceLevels", [1, 100]);
		});

		it.each(['["0"]', '["101"]', '["ten"]', "not json"])("rejects the announce levels %s", (xpAnnounceLevels) => {
			expect(parse({ xpAnnounceLevels }).success).toBe(false);
		});

		it("limits the announce levels to 100 entries", () => {
			const levels = (count: number) => JSON.stringify(Array.from({ length: count }, () => "1"));

			expect(parse({ xpAnnounceLevels: levels(100) }).success).toBe(true);
			expect(parse({ xpAnnounceLevels: levels(101) }).success).toBe(false);
		});

		it("accepts a minimum level of 1 to 500", () => {
			expect(parse({ xpAnnounceMinimumLevel: "1" }).output).toHaveProperty("xpAnnounceMinimumLevel", 1);
			expect(parse({ xpAnnounceMinimumLevel: "500" }).output).toHaveProperty("xpAnnounceMinimumLevel", 500);
		});

		it("rejects a minimum level outside 1 to 500", () => {
			expect(parse({ xpAnnounceMinimumLevel: "0" }).success).toBe(false);
			expect(parse({ xpAnnounceMinimumLevel: "501" }).success).toBe(false);
		});

		it("accepts a factor of 1 to 250", () => {
			expect(parse({ xpAnnounceMultipleOf: "1" }).output).toHaveProperty("xpAnnounceMultipleOf", 1);
			expect(parse({ xpAnnounceMultipleOf: "250" }).output).toHaveProperty("xpAnnounceMultipleOf", 250);
		});

		it("rejects a factor outside 1 to 250", () => {
			expect(parse({ xpAnnounceMultipleOf: "0" }).success).toBe(false);
			expect(parse({ xpAnnounceMultipleOf: "251" }).success).toBe(false);
		});
	});

	describe("level up message embed", () => {
		it("accepts an embed with every text at its length limit", () => {
			const result = withEmbed({
				author: { name: "a".repeat(256) },
				description: "a".repeat(4096),
				fields: Array.from({ length: 25 }, () => ({ name: "a".repeat(256), value: "a".repeat(1024) })),
				footer: { text: "a".repeat(2048) },
				title: "a".repeat(256),
			});

			expect(result.success).toBe(true);
		});

		it("accepts an embed with only a description", () => {
			const result = parse({ xpMessageEmbed: '{"description":"{user} leveled up"}' });

			expect(result.output).toHaveProperty("xpMessageEmbed", { description: "{user} leveled up" });
		});

		it.each([
			["a title over 256 characters", { title: "a".repeat(257) }],
			["a description over 4096 characters", { description: "a".repeat(4097) }],
			["more than 25 fields", { fields: Array.from({ length: 26 }, () => ({ name: "Name", value: "Value" })) }],
			["a field without a name", { fields: [{ name: "", value: "Value" }] }],
			["a field without a value", { fields: [{ name: "Name", value: "" }] }],
			["a field name over 256 characters", { fields: [{ name: "a".repeat(257), value: "Value" }] }],
			["a field value over 1024 characters", { fields: [{ name: "Name", value: "a".repeat(1025) }] }],
			["an author without a name", { author: { name: "" } }],
			["an author name over 256 characters", { author: { name: "a".repeat(257) } }],
			["a footer without text", { footer: { text: "" } }],
			["a footer text over 2048 characters", { footer: { text: "a".repeat(2049) } }],
			["a URL under 10 characters", { url: "http://a" }],
			["a URL over 2048 characters", { url: `https://lurkr.gg/${"a".repeat(2048)}` }],
			["an image URL under 10 characters", { image: { url: "http://a" } }],
			["a thumbnail URL under 10 characters", { thumbnail: { url: "http://a" } }],
			["a colour above #ffffff", { color: 0x1_00_00_00 }],
			["a negative colour", { color: -1 }],
			["a fractional colour", { color: 1.5 }],
		])("rejects an embed with %s", (_reason, patch) => {
			expect(withEmbed(patch).success).toBe(false);
		});

		it("reports malformed embed JSON as a validation failure", () => {
			expect(parse({ xpMessageEmbed: "{" }).success).toBe(false);
		});
	});

	describe("role rewards", () => {
		it("accepts levels 1 to 10000", () => {
			expect(withRoleReward({ level: 1 }).success).toBe(true);
			expect(withRoleReward({ level: 10_000 }).success).toBe(true);
		});

		it.each([0, 10_001, 2.5, "5", null])("rejects a reward at level %j", (level) => {
			expect(withRoleReward({ level }).success).toBe(false);
		});

		it("rejects a reward role that is not an ID", () => {
			expect(withRoleReward({ roleIds: ["everyone"] }).success).toBe(false);
		});

		it("rejects a reward that does not say whether it stacks", () => {
			const { stack: _stack, ...withoutStack } = roleReward;

			expect(parse({ xpRoleRewards: JSON.stringify([withoutStack]) }).success).toBe(false);
		});

		it("reports malformed role reward JSON as a validation failure", () => {
			expect(parse({ xpRoleRewards: "[{" }).success).toBe(false);
		});

		it("limits a regular server to 3 roles per reward", () => {
			expect(withRoleReward({ roleIds: snowflakes(3) }).success).toBe(true);
			expect(withRoleReward({ roleIds: snowflakes(4) }).success).toBe(false);
		});

		it("limits a premium server to 10 roles per reward", () => {
			expect(withRoleReward({ roleIds: snowflakes(10) }, true).success).toBe(true);
			expect(withRoleReward({ roleIds: snowflakes(11) }, true).success).toBe(false);
		});

		it.each([
			[false, 50],
			[true, 100],
		])("limits a server with premium %j to %i rewards", (premium, limit) => {
			const rewards = (count: number) =>
				JSON.stringify(Array.from({ length: count }, (_, index) => ({ ...roleReward, id: `id-${index}` })));

			expect(parse({ xpRoleRewards: rewards(limit) }, premium).success).toBe(true);
			expect(parse({ xpRoleRewards: rewards(limit + 1) }, premium).success).toBe(false);
		});
	});

	describe("channel and role lists", () => {
		it.each([
			["noRoleRewardRoles", false, 10],
			["noRoleRewardRoles", true, 25],
			["noTopXpRoles", false, 10],
			["noTopXpRoles", true, 25],
			["noXpRoles", false, 5],
			["noXpRoles", true, 10],
			["xpChannels", false, 30],
			["xpChannels", true, 50],
		])("limits %s on a server with premium %j to %i entries", (setting, premium, limit) => {
			expect(parse({ [setting]: snowflakes(limit).join(",") }, premium).success).toBe(true);
			expect(parse({ [setting]: snowflakes(limit + 1).join(",") }, premium).success).toBe(false);
		});
	});

	describe("disallowed prefixes", () => {
		const prefixes = (count: number) => JSON.stringify(Array.from({ length: count }, (_, index) => `!${index}`));

		it("accepts a prefix of up to 25 characters", () => {
			expect(parse({ xpDisallowedPrefixes: JSON.stringify(["a".repeat(25)]) }).success).toBe(true);
			expect(parse({ xpDisallowedPrefixes: JSON.stringify(["a".repeat(26)]) }).success).toBe(false);
		});

		it("limits a regular server to 10 prefixes", () => {
			expect(parse({ xpDisallowedPrefixes: prefixes(10) }).success).toBe(true);
			expect(parse({ xpDisallowedPrefixes: prefixes(11) }).success).toBe(false);
		});

		it("limits a premium server to 25 prefixes", () => {
			expect(parse({ xpDisallowedPrefixes: prefixes(25) }, true).success).toBe(true);
			expect(parse({ xpDisallowedPrefixes: prefixes(26) }, true).success).toBe(false);
		});
	});

	describe("customisation and leaderboard", () => {
		it("accepts a form without a rank card colour", () => {
			const { accentColour: _accentColour, ...withoutColour } = form;

			expect(safeParse(schema(false), withoutColour).success).toBe(true);
		});

		it("accepts a rank card colour in either case", () => {
			expect(parse({ accentColour: "#FFAA00" }).output).toHaveProperty("accentColour", "#FFAA00");
		});

		it.each(["ff7077", "#fff", "#ff70777", "red"])("rejects the rank card colour %j", (accentColour) => {
			expect(parse({ accentColour }).success).toBe(false);
		});

		it.each(["My Server", "a", "a".repeat(33)])("rejects the leaderboard vanity %j", (vanity) => {
			expect(parse({ vanity }).success).toBe(false);
		});

		it("rejects an unknown leaderboard visibility", () => {
			expect(parse({ leaderboardVisibility: "Private" }).success).toBe(false);
		});

		it("rejects an unknown leveling channel mode", () => {
			expect(parse({ xpChannelMode: "Allowlist" }).success).toBe(false);
		});
	});
});
