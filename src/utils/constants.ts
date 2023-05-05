/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

// TODO: Use `${bigint}`?
export type Snowflake = string;

export const enum Time {
	Seconds = 1_000,
	Minutes = Seconds * 60,
	Hours = Minutes * 60,
	Days = Hours * 24,
	Weeks = Days * 7,
	Years = Days * 365.241_25,
	Months = Years / 12,
}

export const DESCRIPTION =
	"The Ultimate No-Paywall & Featureful Leveling Bot. Powerful Utility and Automation for your Best Discord Server!";

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

// Length is not being validated here as it's done separately
export const VANITY_REGEX = /^[\da-z]+$/i;

export { default as FALLBACK_AVATAR } from "~/assets/fallback-avatar.png";
