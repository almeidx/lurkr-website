import { describe, expect, it } from "vitest";
import { type GuildOverview, resolveOverviewStatuses } from "./resolve-overview-statuses.ts";

const healthy: GuildOverview = {
	autoPublishChannels: "OK",
	autoRole: "OK",
	autoRoleFlags: "OK",
	emojiList: "OK",
	mentionCooldown: "OK",
	milestonesChannel: "OK",
	milestonesRoles: "OK",
	storeCounts: "OK",
	topXpRole: "OK",
	xpAnnouncementChannel: "OK",
	xpAnnounceOnlyXpRoles: "OK",
	xpChannels: "OK",
	xpRoleRewards: "OK",
};

function statusOf(overview: GuildOverview, name: string) {
	return resolveOverviewStatuses(overview).find((status) => status.name === name);
}

describe("resolveOverviewStatuses", () => {
	it("reports every system of a healthy server as a success without a description", () => {
		const statuses = resolveOverviewStatuses(healthy);

		expect(statuses).toHaveLength(Object.keys(healthy).length);
		expect(new Set(statuses.map((status) => status.name)).size).toBe(statuses.length);

		for (const status of statuses) {
			expect(status).toEqual({ name: status.name, type: "success" });
		}
	});

	it("explains a disabled system", () => {
		expect(statusOf({ ...healthy, autoRole: "DISABLED" }, "On Join Roles")).toEqual({
			description: "The system is disabled",
			name: "On Join Roles",
			type: "disabled",
		});
	});

	it.each([
		["emojiList", "NO_CHANNEL", "Emoji List Channel", "warning"],
		["emojiList", "SET_BUT_DISABLED", "Emoji List Channel", "error"],
		["mentionCooldown", "NO_ROLES", "Role Mention Cooldown Roles", "warning"],
		["milestonesChannel", "NO_CHANNEL", "Milestone Channel", "warning"],
		["storeCounts", "NOT_ENOUGH_MEMBERS", "Member Count Tracking", "error"],
		["topXpRole", "SET_BUT_DISABLED", "Daily Top Leveling Role", "error"],
		["xpAnnounceOnlyXpRoles", "NO_XP_ROLE_REWARDS", "Only Announce Level-Ups Together", "warning"],
		["xpChannels", "WHITELIST_EMPTY", "Leveling Channels", "warning"],
	] as const)("flags %s being %s on %j as a %s", (key, state, name, type) => {
		const status = statusOf({ ...healthy, [key]: state }, name);

		expect(status?.type).toBe(type);
		expect(status?.description).toEqual(expect.any(String));
	});

	it("leaves the other systems untouched when one has a problem", () => {
		const statuses = resolveOverviewStatuses({ ...healthy, xpChannels: "WHITELIST_EMPTY" });

		expect(statuses.filter((status) => status.type !== "success")).toHaveLength(1);
	});

	it("keeps the display order whatever order the API returns the keys in", () => {
		const reversed = Object.fromEntries(Object.entries(healthy).toReversed()) as unknown as GuildOverview;

		expect(resolveOverviewStatuses(reversed)).toEqual(resolveOverviewStatuses(healthy));
	});
});
