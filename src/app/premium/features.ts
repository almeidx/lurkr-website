import {
	MAX_AUTO_PUBLISH_CHANNELS,
	MAX_AUTO_PUBLISH_CHANNELS_PREMIUM,
	MAX_AUTO_ROLES,
	MAX_AUTO_ROLES_PREMIUM,
	MAX_MENTION_COOLDOWN,
	MAX_MENTION_COOLDOWN_PREMIUM,
	MAX_MILESTONES_ROLES,
	MAX_MILESTONES_ROLES_PREMIUM,
	MAX_NO_TOP_XP_ROLES,
	MAX_NO_TOP_XP_ROLES_PREMIUM,
	MAX_NO_XP_ROLES,
	MAX_NO_XP_ROLES_PREMIUM,
	MAX_XP_CHANNELS,
	MAX_XP_CHANNELS_PREMIUM,
	MAX_XP_DISALLOWED_PREFIXES,
	MAX_XP_DISALLOWED_PREFIXES_PREMIUM,
	MAX_XP_MULTIPLIERS,
	MAX_XP_MULTIPLIERS_PREMIUM,
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MAX_XP_ROLE_REWARD_ROLES,
	MAX_XP_ROLE_REWARD_ROLES_PREMIUM,
} from "@/lib/guild-config.ts";

export const levelingFeatures: LevelingFeature[] = [
	{ name: "Unlimited Leveling", free: true, max: true, ultimate: true },
	{ name: "Role Rewards", free: true, max: true, ultimate: true },
	{ name: "Import Leaderboard from Bots", free: true, max: true, ultimate: true },
	{ name: "Multipliers (Custom Leveling Speed)", free: true, max: true, ultimate: true },
	{ name: "Custom Level Up Message", free: true, max: true, ultimate: true },
	{ name: "Custom Leveling Card", free: true, max: true, ultimate: true },
	{ name: "Command Access to /level & /xp", free: true, max: true, ultimate: true },
	{ name: "Premium Lurkr for You", free: false, max: true, ultimate: true },
	{ name: "Premium Lurkr for a Server", free: false, max: false, ultimate: true },
];

// biome-ignore format:
export const configLimitFeatures: ConfigLimitComparison[] = [
	{ name: "Leveling Rewards Roles (Per Level)", free: MAX_XP_ROLE_REWARD_ROLES, ultimate: MAX_XP_ROLE_REWARD_ROLES_PREMIUM, suffix: "per level" },
	{ name: "Leveling Rewards Roles (Total)", free: MAX_XP_ROLE_REWARDS, ultimate: MAX_XP_ROLE_REWARDS_PREMIUM, suffix: "roles total" },
	{ name: "Leveling Multipliers", free: MAX_XP_MULTIPLIERS, ultimate: MAX_XP_MULTIPLIERS_PREMIUM, suffix: "multipliers total" },
	{ name: "Multiplier Channels/Roles", free: MAX_XP_MULTIPLIER_TARGETS, ultimate: MAX_XP_MULTIPLIER_TARGETS_PREMIUM, suffix: "per multiplier" },
	{ name: "Role Mention Cooldown", free: MAX_MENTION_COOLDOWN, ultimate: MAX_MENTION_COOLDOWN_PREMIUM, suffix: "minutes" },
	{ name: "Leveling Leaderboard", free: 100, ultimate: 200, suffix: "users" },
	{ name: "Leveling Channels", free: MAX_XP_CHANNELS, ultimate: MAX_XP_CHANNELS_PREMIUM, suffix: "channels" },
	{ name: "No Top Leveling Roles", free: MAX_NO_TOP_XP_ROLES, ultimate: MAX_NO_TOP_XP_ROLES_PREMIUM, suffix: "roles" },
	{ name: "No Leveling Roles", free: MAX_NO_XP_ROLES, ultimate: MAX_NO_XP_ROLES_PREMIUM, suffix: "roles" },
	{ name: "Ignored Leveling Bot Prefixes", free: MAX_XP_DISALLOWED_PREFIXES, ultimate: MAX_XP_DISALLOWED_PREFIXES_PREMIUM, suffix: "prefixes" },
	{ name: "On Join Roles", free: MAX_AUTO_ROLES, ultimate: MAX_AUTO_ROLES_PREMIUM, suffix: "roles" },
	{ name: "Auto-Publish Channels", free: MAX_AUTO_PUBLISH_CHANNELS, ultimate: MAX_AUTO_PUBLISH_CHANNELS_PREMIUM, suffix: "channels" },
	{ name: "Milestone Reward Roles", free: MAX_MILESTONES_ROLES, ultimate: MAX_MILESTONES_ROLES_PREMIUM, suffix: "roles" },
]

export const extraFeatures: LevelingFeature[] = [
	{ name: "No Tips on /level Command", free: false, max: true, ultimate: true },
	{ name: "Premium Support", free: false, max: true, ultimate: true },
	{ name: "Exclusive role in support server", free: false, max: true, ultimate: true },
	{ name: "Beta access to new features", free: false, max: true, ultimate: true },
];

export interface LevelingFeature {
	name: string;
	free: boolean;
	max: boolean;
	ultimate: boolean;
}

export interface ConfigLimitComparison {
	name: string;
	free: number;
	max?: number;
	ultimate: number;
	suffix: string;
}
