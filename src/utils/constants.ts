// TODO: Use `${bigint}`?
export type Snowflake = string;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// https://discord.com/developers/docs/reference#snowflakes
export const MIN_SNOWFLAKE = 0b0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0010_0001_0000_0000_0001;

// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
export const MAX_SNOWFLAKE = BigInt("0b1111111111111111111111111111111111111111111111111111111111111111");

export const DEFAULT_ROLE_COLOUR = "rgb(185, 187, 190)";

/**
 * Gets the XP required to achieve a level
 *
 * @remarks - un = 100 + 50 * (n - 1) ** 2
 * @returns The XP required
 */
export function getRequiredXp(level: number): number {
	return level === 0 ? 0 : 100 + 50 * (level - 1) ** 2;
}

export const DATABASE_LIMITS = {
	autoPublishChannels: { maxLength: 5 },
	autoRole: { maxLength: 5 },
	autoRoleTimeout: { max: 1_800_000, min: 60_000 },
	mentionCooldown: { max: 1_800_000, min: 300_000 },
	mentionCooldownRoles: { maxLength: 25 },
	milestonesInterval: { max: 100_000, min: 10 },
	milestonesMessage: { maxLength: 1_000 },
	milestonesRoles: { maxLength: 5 },
	noXpRoles: { maxLength: 30 },
	vanity: { maxLength: 32, minLength: 2 },
	xpChannels: { maxLength: 30 },
	xpDisallowedPrefixes: { maxLength: 10 },
	xpAnnounceLevels: { maxLength: 100 },
	xpAnnounceLevel: { max: 100, min: 1 },
	xpAnnounceMinimumLevel: { max: 500, min: 1 },
	xpAnnounceMultipleOf: { min: 1, max: 250 },
	xpMessage: { maxLength: 1_000 },
	xpMultiplierTargets: { maxLength: 30 },
	xpMultipliers: { maxLength: 10 },
	xpRoleRewards: { maxLength: 100 },
	xpRolesPerLevel: { maxLength: 5 },
};

export const DATABASE_PREMIUM_LIMITS = {
	autoPublishChannels: { maxLength: 25 },
	autoRole: { maxLength: 25 },
	autoRoleTimeout: { max: 1_800_000, min: 60_000 },
	mentionCooldown: { max: 1_800_000, min: 300_000 },
	mentionCooldownRoles: { maxLength: 25 },
	milestonesInterval: { max: 100_000, min: 10 },
	milestonesMessage: { maxLength: 1_000 },
	milestonesRoles: { maxLength: 10 },
	noXpRoles: { maxLength: 30 },
	vanity: { maxLength: 32, minLength: 2 },
	xpAnnounceLevels: { maxLength: 100 },
	xpAnnounceLevel: { max: 100, min: 1 },
	xpAnnounceMinimumLevel: { max: 500, min: 1 },
	xpAnnounceMultipleOf: { min: 1, max: 250 },
	xpChannels: { maxLength: 50 },
	xpDisallowedPrefixes: { maxLength: 25 },
	xpMessage: { maxLength: 1_000 },
	xpMultiplierTargets: { maxLength: 50 },
	xpMultipliers: { maxLength: 25 },
	xpRoleRewards: { maxLength: 100 },
	xpRolesPerLevel: { maxLength: 25 },
};

// Length is not being validated here as it's done separately
export const VANITY_REGEX = /^[\da-z]+$/i;

export { default as FALLBACK_AVATAR } from "~/assets/fallback-avatar.png";
