import { PREMIUM_LIMITS, type PremiumLimit } from "@/lib/guild-config.ts";

export const configLimitFeatures: ConfigLimitComparison[] = [
	limitRow("xpRoleRewardRoles", "Leveling Rewards Roles (Per Level)", "per level"),
	limitRow("xpRoleRewards", "Leveling Rewards Roles (Total)", "roles total"),
	limitRow("noRoleRewardRoles", "No Role Reward Roles", "roles"),
	limitRow("xpMultipliers", "Leveling Multipliers", "multipliers total"),
	limitRow("xpMultiplierTargets", "Multiplier Channels/Roles", "per multiplier"),
	limitRow("mentionCooldown", "Role Mention Cooldown", "hours", (minutes) => minutes / 60),
	// The bot's `/leaderboard` shows 10 pages of 10 users, or 50 pages for premium servers.
	{ free: 100, name: "Leveling Leaderboard", suffix: "users", ultimate: 500 },
	limitRow("xpChannels", "Leveling Channels", "channels"),
	limitRow("noTopXpRoles", "No Top Leveling Roles", "roles"),
	limitRow("noXpRoles", "No Leveling Roles", "roles"),
	limitRow("xpDisallowedPrefixes", "Ignored Leveling Bot Prefixes", "prefixes"),
	limitRow("autoRole", "On Join Roles", "roles"),
	limitRow("autoPublishChannels", "Auto-Publish Channels", "channels"),
	limitRow("milestonesRoles", "Milestone Reward Roles", "roles"),
];

export const extraFeatures: LevelingFeature[] = [
	{ free: false, max: true, name: "No Tips on /level Command", ultimate: true },
	{ free: false, max: true, name: "Premium Support", ultimate: true },
	{ free: false, max: true, name: "Exclusive role in support server", ultimate: true },
	{ free: false, max: true, name: "Beta access to new features", ultimate: true },
];

function limitRow(
	limit: PremiumLimit,
	name: string,
	suffix: string,
	toUnit = (value: number) => value,
): ConfigLimitComparison {
	const { premium, regular } = PREMIUM_LIMITS[limit];
	return { free: toUnit(regular), name, suffix, ultimate: toUnit(premium) };
}

export interface LevelingFeature {
	name: string;
	free: boolean;
	max: boolean;
	ultimate: boolean;
}

export interface ConfigLimitComparison {
	name: string;
	free: number;
	ultimate: number;
	suffix: string;
}
