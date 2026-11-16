import type { ItemStatusProps } from "./item-status.tsx";

export interface GuildOverview {
	readonly autoPublishChannels: "DISABLED" | "OK";
	readonly autoRole: "DISABLED" | "OK";
	readonly autoRoleFlags: "DISABLED" | "OK";
	readonly emojiList: "DISABLED" | "NO_CHANNEL" | "OK" | "SET_BUT_DISABLED";
	readonly mentionCooldown: "DISABLED" | "NO_ROLES" | "OK";
	readonly milestonesChannel: "DISABLED" | "NO_CHANNEL" | "OK";
	readonly milestonesRoles: "DISABLED" | "OK";
	readonly storeCounts: "DISABLED" | "NOT_ENOUGH_MEMBERS" | "OK";
	readonly topXpRole: "DISABLED" | "OK" | "SET_BUT_DISABLED";
	readonly xpAnnounceOnlyXpRoles: "DISABLED" | "NO_XP_ROLE_REWARDS" | "OK";
	readonly xpAnnouncementChannel: "DISABLED" | "OK";
	readonly xpChannels: "DISABLED" | "OK" | "WHITELIST_EMPTY";
	readonly xpRoleRewards: "DISABLED" | "OK";
}

interface Problem {
	readonly description: string;
	readonly type: Exclude<ItemStatusProps["type"], "success">;
}

const DISABLED: Problem = { description: "The system is disabled", type: "disabled" };

type OverviewItems = {
	readonly [K in keyof GuildOverview]: {
		readonly name: string;
		readonly problems: Record<Exclude<GuildOverview[K], "OK">, Problem>;
	};
};

// oxlint-disable-next-line sort-keys -- the key order is the display order
const OVERVIEW_ITEMS: OverviewItems = {
	autoPublishChannels: { name: "Auto-Publishing Channels", problems: { DISABLED } },
	autoRole: { name: "On Join Roles", problems: { DISABLED } },
	autoRoleFlags: { name: "On Join Roles For Badges", problems: { DISABLED } },
	emojiList: {
		name: "Emoji List Channel",
		problems: {
			DISABLED,
			NO_CHANNEL: { description: "The emoji list channel is not set", type: "warning" },
			SET_BUT_DISABLED: { description: "The channel is set but the system is disabled", type: "error" },
		},
	},
	mentionCooldown: {
		name: "Role Mention Cooldown Roles",
		problems: { DISABLED, NO_ROLES: { description: "No roles are set", type: "warning" } },
	},
	milestonesChannel: {
		name: "Milestone Channel",
		problems: { DISABLED, NO_CHANNEL: { description: "The milestone channel is not set", type: "warning" } },
	},
	milestonesRoles: { name: "Milestone Roles", problems: { DISABLED } },
	storeCounts: {
		name: "Member Count Tracking",
		problems: {
			DISABLED,
			NOT_ENOUGH_MEMBERS: {
				description: "System is enabled but your server does not have enough members",
				type: "error",
			},
		},
	},
	topXpRole: {
		name: "Daily Top Leveling Role",
		problems: {
			DISABLED,
			SET_BUT_DISABLED: {
				description: "The Top Leveling Role is set but the leveling system is disabled",
				type: "error",
			},
		},
	},
	xpAnnounceOnlyXpRoles: {
		name: "Only Announce Level-Ups Together",
		problems: {
			DISABLED: { description: "The option is disabled", type: "disabled" },
			NO_XP_ROLE_REWARDS: { description: "No roles are set", type: "warning" },
		},
	},
	xpAnnouncementChannel: { name: "Level Up Message Channel", problems: { DISABLED } },
	xpChannels: {
		name: "Leveling Channels",
		problems: {
			DISABLED,
			WHITELIST_EMPTY: {
				description:
					"The Leveling Channel Mode is set to whitelist but there are no channels set. This means users cannot gain experience anywhere",
				type: "warning",
			},
		},
	},
	xpRoleRewards: { name: "Leveling Role Rewards", problems: { DISABLED } },
};

export function resolveOverviewStatuses(overview: GuildOverview): ItemStatusProps[] {
	return Object.entries(OVERVIEW_ITEMS).map(([key, { name, problems }]) => {
		const problem = (problems as Partial<Record<string, Problem>>)[overview[key as keyof GuildOverview]];
		return problem ? { name, ...problem } : { name, type: "success" };
	});
}
