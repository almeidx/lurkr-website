import type { Snowflake } from "./constants";

type ImageSizes = 1_024 | 2_048 | 4_096 | 16 | 32 | 64 | 128 | 256 | 512;

/**
 * Resolves a Discord guild icon CDN URL.
 *
 * @param id - The ID of the guild.
 * @param hash - The icon hash.
 * @param size - The size for the icon.
 * @param allowAnimated - Whether to allow animated icons.
 */
export const guildIconCdn = (id: Snowflake, hash: string, size: ImageSizes, allowAnimated = true) =>
	`https://cdn.discordapp.com/icons/${id}/${hash}.${
		allowAnimated && hash.startsWith("a_") ? "gif" : "webp"
	}?size=${size}`;

/**
 * Resolves a Discord user avatar CDN URL.
 *
 * @param id - The ID of the user.
 * @param hash - The avatar hash.
 * @param size - The size for the avatar.
 * @param allowAnimated - Whether to allow animated avatars.
 */
export const userAvatarCdn = (id: Snowflake, hash: string, size: ImageSizes, allowAnimated = true) =>
	`https://cdn.discordapp.com/avatars/${id}/${hash}.${
		allowAnimated && hash.startsWith("a_") ? "gif" : "webp"
	}?size=${size}`;

/**
 * Resolves a Discord user default avatar CDN URL.
 *
 * @param discriminator - The user discriminator.
 * @param size - The size for the avatar.
 */
export const userDefaultAvatarCdn = (discriminator: string, size: ImageSizes) =>
	`https://cdn.discordapp.com/avatars/${Number.parseInt(discriminator, 10) % 4}.webp?size=${size}`;
