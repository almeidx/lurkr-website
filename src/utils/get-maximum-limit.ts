import {
	MAX_AUTO_PUBLISH_CHANNELS,
	MAX_AUTO_PUBLISH_CHANNELS_PREMIUM,
	MAX_AUTO_ROLES,
	MAX_AUTO_ROLES_PREMIUM,
	MAX_AUTO_ROLE_FLAGS_ROLES,
	MAX_AUTO_ROLE_TIMEOUT,
	MAX_MENTION_COOLDOWN,
	MAX_MENTION_COOLDOWN_ROLES,
	MAX_MILESTONES_INTERVAL,
	MAX_MILESTONES_MESSAGE_LENGTH,
	MAX_MILESTONES_ROLES,
	MAX_MILESTONES_ROLES_PREMIUM,
	MAX_NO_ROLE_REWARD_ROLES,
	MAX_NO_ROLE_REWARD_ROLES_PREMIUM,
	MAX_NO_TOP_XP_ROLES,
	MAX_NO_TOP_XP_ROLES_PREMIUM,
	MAX_NO_XP_ROLES,
	MAX_NO_XP_ROLES_PREMIUM,
	MAX_VANITY_LENGTH,
	MAX_XP_CHANNELS,
	MAX_XP_CHANNELS_PREMIUM,
	MAX_XP_DISALLOWED_PREFIXES,
	MAX_XP_DISALLOWED_PREFIXES_PREMIUM,
	MAX_XP_MESSAGE_LENGTH,
	MAX_XP_MULTIPLIERS,
	MAX_XP_MULTIPLIERS_PREMIUM,
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MAX_XP_ROLE_REWARD_ROLES,
	MAX_XP_ROLE_REWARD_ROLES_PREMIUM,
} from "@/lib/guild-config.ts";
import type { GuildSettings } from "@/lib/guild.ts";

export function getMaximumLimit(setting: LimitedKey, premium: boolean) {
	switch (setting) {
		case "autoPublishChannels":
			return premium ? MAX_AUTO_PUBLISH_CHANNELS_PREMIUM : MAX_AUTO_PUBLISH_CHANNELS;

		case "autoRole":
			return premium ? MAX_AUTO_ROLES_PREMIUM : MAX_AUTO_ROLES;

		case "autoRoleFlags":
			return MAX_AUTO_ROLE_FLAGS_ROLES;

		case "autoRoleTimeout":
			return MAX_AUTO_ROLE_TIMEOUT;

		case "mentionCooldown":
			return MAX_MENTION_COOLDOWN;

		case "mentionCooldownRoles":
			return MAX_MENTION_COOLDOWN_ROLES;

		case "milestonesInterval":
			return MAX_MILESTONES_INTERVAL;

		case "milestonesMessage":
			return MAX_MILESTONES_MESSAGE_LENGTH;

		case "milestonesRoles":
			return premium ? MAX_MILESTONES_ROLES_PREMIUM : MAX_MILESTONES_ROLES;

		case "noTopXpRoles":
			return premium ? MAX_NO_TOP_XP_ROLES_PREMIUM : MAX_NO_TOP_XP_ROLES;

		case "noRoleRewardRoles":
			return premium ? MAX_NO_ROLE_REWARD_ROLES_PREMIUM : MAX_NO_ROLE_REWARD_ROLES;

		case "noXpRoles":
			return premium ? MAX_NO_XP_ROLES_PREMIUM : MAX_NO_XP_ROLES;

		case "vanity":
			return MAX_VANITY_LENGTH;

		case "xpChannels":
			return premium ? MAX_XP_CHANNELS_PREMIUM : MAX_XP_CHANNELS;

		case "xpDisallowedPrefixes":
			return premium ? MAX_XP_DISALLOWED_PREFIXES_PREMIUM : MAX_XP_DISALLOWED_PREFIXES;

		case "xpMessage":
			return MAX_XP_MESSAGE_LENGTH;

		case "xpMultipliers":
			return premium ? MAX_XP_MULTIPLIERS_PREMIUM : MAX_XP_MULTIPLIERS;

		case "xpMultiplierTargets":
			return premium ? MAX_XP_MULTIPLIER_TARGETS_PREMIUM : MAX_XP_MULTIPLIER_TARGETS;

		case "xpRoleRewards":
			return premium ? MAX_XP_ROLE_REWARDS_PREMIUM : MAX_XP_ROLE_REWARDS;

		case "xpRoleRewardRoles":
			return premium ? MAX_XP_ROLE_REWARD_ROLES_PREMIUM : MAX_XP_ROLE_REWARD_ROLES;
	}
}

type LimitedKey =
	| Exclude<
			keyof GuildSettings,
			| "accentColour"
			| "accentType"
			| "autoResetLevels"
			| "emojiList"
			| "emojiListChannel"
			| "id"
			| "levels"
			| "milestonesChannel"
			| "premium"
			| "prioritiseMultiplierRoleHierarchy"
			| "stackXpRoles"
			| "storeCounts"
			| "storeMilestones"
			| "topXpRole"
			| "voteBoostedXp"
			| "xpAnnounceChannel"
			| "xpAnnounceChannelType"
			| "xpAnnounceLevels"
			| "xpAnnounceMinimumLevel"
			| "xpAnnounceMultipleOf"
			| "xpAnnounceOnlyXpRoles"
			| "xpChannelMode"
			| "xpInThreads"
	  >
	| "xpMultiplierTargets"
	| "xpRoleRewardRoles";
