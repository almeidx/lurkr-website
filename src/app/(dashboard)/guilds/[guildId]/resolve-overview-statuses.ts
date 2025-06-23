import type { ComponentProps } from "react";
import type { ItemStatus } from "./item-status.tsx";
import type { GetGuildOverviewResult } from "./page.tsx";

export function resolveOverviewStatuses(overview: GetGuildOverviewResult) {
	const result: ComponentProps<typeof ItemStatus>[] = [];

	if (overview.autoPublishChannels === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Auto-Publishing Channels", type: "disabled" });
	} else {
		result.push({ name: "Auto-Publishing Channels", type: "success" });
	}

	if (overview.autoRole === "DISABLED") {
		result.push({ description: "The system is disabled", name: "On Join Roles", type: "disabled" });
	} else {
		result.push({ name: "On Join Roles", type: "success" });
	}

	if (overview.autoRoleFlags === "DISABLED") {
		result.push({ description: "The system is disabled", name: "On Join Roles For Badges", type: "disabled" });
	} else {
		result.push({ name: "On Join Roles For Badges", type: "success" });
	}

	if (overview.emojiList === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Emoji List Channel", type: "disabled" });
	} else if (overview.emojiList === "NO_CHANNEL") {
		result.push({ description: "The emoji list channel is not set", name: "Emoji List Channel", type: "warning" });
	} else if (overview.emojiList === "SET_BUT_DISABLED") {
		result.push({
			description: "The channel is set but the system is disabled",
			name: "Emoji List Channel",
			type: "error",
		});
	} else {
		result.push({ name: "Emoji List Channel", type: "success" });
	}

	if (overview.mentionCooldown === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Role Mention Cooldown Roles", type: "disabled" });
	} else if (overview.mentionCooldown === "NO_ROLES") {
		result.push({ description: "No roles are set", name: "Role Mention Cooldown Roles", type: "warning" });
	} else {
		result.push({ name: "Role Mention Cooldown Roles", type: "success" });
	}

	if (overview.milestonesChannel === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Milestone Channel", type: "disabled" });
	} else if (overview.milestonesChannel === "NO_CHANNEL") {
		result.push({ description: "The milestone channel is not set", name: "Milestone Channel", type: "warning" });
	} else {
		result.push({ name: "Milestone Channel", type: "success" });
	}

	if (overview.milestonesRoles === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Milestone Roles", type: "disabled" });
	} else {
		result.push({ name: "Milestone Roles", type: "success" });
	}

	if (overview.storeCounts === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Member Count Tracking", type: "disabled" });
	} else if (overview.storeCounts === "NOT_ENOUGH_MEMBERS") {
		result.push({
			description: "System is enabled but your server does not have enough members",
			name: "Member Count Tracking",
			type: "error",
		});
	} else {
		result.push({ name: "Member Count Tracking", type: "success" });
	}

	if (overview.topXpRole === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Daily Top Leveling Role", type: "disabled" });
	} else if (overview.topXpRole === "SET_BUT_DISABLED") {
		result.push({
			description: "The Top Leveling Role is set but the leveling system is disabled",
			name: "Daily Top Leveling Role",
			type: "error",
		});
	} else {
		result.push({ name: "Daily Top Leveling Role", type: "success" });
	}

	if (overview.xpAnnounceOnlyXpRoles === "DISABLED") {
		result.push({ description: "The option is disabled", name: "Only Announce Level-Ups Together", type: "disabled" });
	} else if (overview.xpAnnounceOnlyXpRoles === "NO_XP_ROLE_REWARDS") {
		result.push({ description: "No roles are set", name: "Only Announce Level-Ups Together", type: "warning" });
	} else {
		result.push({ name: "Only Announce Level-Ups Together", type: "success" });
	}

	if (overview.xpAnnouncementChannel === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Level Up Message Channel", type: "disabled" });
	} else {
		result.push({ name: "Level Up Message Channel", type: "success" });
	}

	if (overview.xpChannels === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Leveling Channels", type: "disabled" });
	} else if (overview.xpChannels === "WHITELIST_EMPTY") {
		result.push({
			description:
				"The Leveling Channel Mode is set to whitelist but there are no channels set. This means users cannot gain experience anywhere",
			name: "Leveling Channels",
			type: "warning",
		});
	} else {
		result.push({ name: "Leveling Channels", type: "success" });
	}

	if (overview.xpRoleRewards === "DISABLED") {
		result.push({ description: "The system is disabled", name: "Leveling Role Rewards", type: "disabled" });
	} else {
		result.push({ name: "Leveling Role Rewards", type: "success" });
	}

	return result;
}
