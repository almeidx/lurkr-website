/**
 * Limits that are raised for premium servers. Each entry is the maximum for regular and premium servers.
 */
export const PREMIUM_LIMITS = {
	autoPublishChannels: { premium: 25, regular: 5 },
	autoRole: { premium: 25, regular: 5 },
	/** In minutes. */
	mentionCooldown: { premium: 24 * 60, regular: 6 * 60 },
	milestonesRoles: { premium: 10, regular: 5 },
	noRoleRewardRoles: { premium: 25, regular: 10 },
	noTopXpRoles: { premium: 25, regular: 10 },
	noXpRoles: { premium: 10, regular: 5 },
	xpChannels: { premium: 50, regular: 30 },
	xpDisallowedPrefixes: { premium: 25, regular: 10 },
	xpMultipliers: { premium: 25, regular: 5 },
	xpMultiplierTargets: { premium: 50, regular: 30 },
	xpRoleRewardRoles: { premium: 10, regular: 3 },
	xpRoleRewards: { premium: 100, regular: 50 },
} as const satisfies Record<string, { premium: number; regular: number }>;

export type PremiumLimit = keyof typeof PREMIUM_LIMITS;

export function limitFor(limit: PremiumLimit, premium: boolean): number {
	return PREMIUM_LIMITS[limit][premium ? "premium" : "regular"];
}

/**
 * @param unit - What is being counted, e.g. `"roles per level"`.
 */
export function limitLabel(limit: PremiumLimit, unit?: string) {
	const { premium, regular } = PREMIUM_LIMITS[limit];
	return `Max. ${regular}${unit ? ` ${unit}` : ""} - Max. ${premium} for Premium`;
}

export const MAX_AUTO_ROLE_FLAGS = 5;
export const MAX_AUTO_ROLE_FLAG_ROLES = 5;

export const MIN_AUTO_ROLE_TIMEOUT = 1;
export const MAX_AUTO_ROLE_TIMEOUT = 30;

export const MIN_MENTION_COOLDOWN = 1;

export const MAX_MENTION_COOLDOWN_ROLES = 25;

export const MIN_MILESTONES_INTERVAL = 100;
export const MAX_MILESTONES_INTERVAL = 100_000;
export const MILESTONES_INTERVAL_MULTIPLE_OF = 5;

export const DEFAULT_MILESTONES_MESSAGE =
	"<:icon_shine1:1086286974928834650> <:icon_shine2:1086289111184318604> <:icon_shine3:1086289109594689547>\n**{milestone} Members**\n<:icon_shine1:1086286974928834650> <:icon_shine2:1086289111184318604> <:icon_shine3:1086289109594689547>\n<:icon_newmembers:1086290928756605070> Congratulations to {user}, you were the {milestone}th person to join!";
export const MIN_MILESTONES_MESSAGE_LENGTH = 10;
export const MAX_MILESTONES_MESSAGE_LENGTH = 1_800;

export const MIN_VANITY_LENGTH = 2;
export const MAX_VANITY_LENGTH = 32;
/** @remarks This pattern does not validate the length of the input. */
export const VANITY_REGEX_SOURCE = String.raw`^[\da-z]+$`;

export const MAX_XP_ANNOUNCE_LEVELS = 100;
export const MIN_XP_ANNOUNCE_LEVEL = 1;
export const MAX_XP_ANNOUNCE_LEVEL = 100;

export const MIN_XP_ANNOUNCE_MINIMUM_LEVEL = 1;
export const MAX_XP_ANNOUNCE_MINIMUM_LEVEL = 500;

export const MIN_XP_ANNOUNCE_MULTIPLE_OF = 1;
export const MAX_XP_ANNOUNCE_MULTIPLE_OF = 250;

export const MIN_XP_CURVE_COEFFICIENTS = 2;
export const MAX_XP_CURVE_COEFFICIENTS = 5;

export const XP_CURVE_PRESETS = {
	amari: [55, -40, 20],
	lurkr: [150, -100, 50],
	mee6: [0, 455 / 6, 45 / 2, 5 / 3],
} as const satisfies Record<string, number[]>;

export type XpCurvePresetName = keyof typeof XP_CURVE_PRESETS;

export const MAX_XP_DISALLOWED_PREFIX_LENGTH = 25;

export const MIN_XP_GAIN_INTERVAL = 10 * 1000;
export const MAX_XP_GAIN_INTERVAL = 24 * 60 * 60 * 1000;

export const MIN_XP_PER_MESSAGE = 1;
export const MAX_XP_PER_MESSAGE = 1000;

export const DEFAULT_XP_MESSAGE = "<:icon_levelup:1086286977118261318> {user} has reached level **{level}**";
export const MIN_XP_MESSAGE_LENGTH = 10;
export const MAX_XP_MESSAGE_LENGTH = 1_800;

export const MIN_XP_MULTIPLIER_VALUE = 0.01;
export const MAX_XP_MULTIPLIER_VALUE = 5;

export const MIN_XP_ROLE_REWARD_LEVEL = 1;
export const MAX_XP_ROLE_REWARD_LEVEL = 10_000;
