import {
	MAX_AUTO_PUBLISH_CHANNELS,
	MAX_AUTO_PUBLISH_CHANNELS_PREMIUM,
	MAX_AUTO_ROLES,
	MAX_AUTO_ROLES_PREMIUM,
	MAX_MENTION_COOLDOWN,
	MAX_MENTION_COOLDOWN_PREMIUM,
	MAX_MILESTONES_ROLES,
	MAX_MILESTONES_ROLES_PREMIUM,
	MAX_NO_ROLE_REWARD_ROLES,
	MAX_NO_ROLE_REWARD_ROLES_PREMIUM,
	MAX_NO_TOP_XP_ROLES,
	MAX_NO_TOP_XP_ROLES_PREMIUM,
	MAX_NO_XP_ROLES,
	MAX_NO_XP_ROLES_PREMIUM,
	MAX_XP_CHANNELS,
	MAX_XP_CHANNELS_PREMIUM,
	MAX_XP_DISALLOWED_PREFIXES,
	MAX_XP_DISALLOWED_PREFIXES_PREMIUM,
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIERS,
	MAX_XP_MULTIPLIERS_PREMIUM,
	MAX_XP_ROLE_REWARD_ROLES,
	MAX_XP_ROLE_REWARD_ROLES_PREMIUM,
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
} from "@/lib/guild-config.ts";

export const levelingFeatures: LevelingFeature[] = [
	{ free: true, max: true, name: "Unlimited Leveling", ultimate: true },
	{ free: true, max: true, name: "Role Rewards", ultimate: true },
	{ free: true, max: true, name: "Import Leaderboard from Bots", ultimate: true },
	{ free: true, max: true, name: "Multipliers (Custom Leveling Speed)", ultimate: true },
	{ free: true, max: true, name: "Custom Level Up Message", ultimate: true },
	{ free: true, max: true, name: "Custom Leveling Card", ultimate: true },
	{ free: true, max: true, name: "Command Access to /level & /xp", ultimate: true },
	{ free: false, max: true, name: "Premium Lurkr for You", ultimate: true },
	{ free: false, max: false, name: "Premium Lurkr for a Server", ultimate: true },
];

// biome-ignore format: Doesn't look so good
export const configLimitFeatures: ConfigLimitComparison[] = [
	{ free: MAX_XP_ROLE_REWARD_ROLES, name: "Leveling Rewards Roles (Per Level)", suffix: "per level", ultimate: MAX_XP_ROLE_REWARD_ROLES_PREMIUM },
	{ free: MAX_XP_ROLE_REWARDS, name: "Leveling Rewards Roles (Total)", suffix: "roles total", ultimate: MAX_XP_ROLE_REWARDS_PREMIUM },
	{ free: MAX_NO_ROLE_REWARD_ROLES, name: "No Role Reward Roles", suffix: "roles", ultimate: MAX_NO_ROLE_REWARD_ROLES_PREMIUM },
	{ free: MAX_XP_MULTIPLIERS, name: "Leveling Multipliers", suffix: "multipliers total", ultimate: MAX_XP_MULTIPLIERS_PREMIUM },
	{ free: MAX_XP_MULTIPLIER_TARGETS, name: "Multiplier Channels/Roles", suffix: "per multiplier", ultimate: MAX_XP_MULTIPLIER_TARGETS_PREMIUM },
	{ free: MAX_MENTION_COOLDOWN, name: "Role Mention Cooldown", suffix: "minutes", ultimate: MAX_MENTION_COOLDOWN_PREMIUM },
	{ free: 100, name: "Leveling Leaderboard", suffix: "users", ultimate: 200 },
	{ free: MAX_XP_CHANNELS, name: "Leveling Channels", suffix: "channels", ultimate: MAX_XP_CHANNELS_PREMIUM },
	{ free: MAX_NO_TOP_XP_ROLES, name: "No Top Leveling Roles", suffix: "roles", ultimate: MAX_NO_TOP_XP_ROLES_PREMIUM },
	{ free: MAX_NO_XP_ROLES, name: "No Leveling Roles", suffix: "roles", ultimate: MAX_NO_XP_ROLES_PREMIUM },
	{ free: MAX_XP_DISALLOWED_PREFIXES, name: "Ignored Leveling Bot Prefixes", suffix: "prefixes", ultimate: MAX_XP_DISALLOWED_PREFIXES_PREMIUM },
	{ free: MAX_AUTO_ROLES, name: "On Join Roles", suffix: "roles", ultimate: MAX_AUTO_ROLES_PREMIUM },
	{ free: MAX_AUTO_PUBLISH_CHANNELS, name: "Auto-Publish Channels", suffix: "channels", ultimate: MAX_AUTO_PUBLISH_CHANNELS_PREMIUM },
	{ free: MAX_MILESTONES_ROLES, name: "Milestone Reward Roles", suffix: "roles", ultimate: MAX_MILESTONES_ROLES_PREMIUM },
];

export const extraFeatures: LevelingFeature[] = [
	{ free: false, max: true, name: "No Tips on /level Command", ultimate: true },
	{ free: false, max: true, name: "Premium Support", ultimate: true },
	{ free: false, max: true, name: "Exclusive role in support server", ultimate: true },
	{ free: false, max: true, name: "Beta access to new features", ultimate: true },
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
