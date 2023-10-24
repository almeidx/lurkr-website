/* eslint-disable jsdoc/check-param-names */

import type { UserContextData } from "~/contexts/UserContext";
import type { Snowflake } from "~/utils/constants";

type ImageSizes = 1_024 | 2_048 | 4_096 | 16 | 32 | 64 | 128 | 256 | 512;

/**
 * Resolves a Discord guild icon CDN URL.
 *
 * @param id - The ID of the guild.
 * @param hash - The icon hash.
 * @param size - The size for the icon.
 * @param allowAnimated - Whether to allow animated icons.
 */
export function guildIconCdn(id: Snowflake, hash: string, size: ImageSizes, allowAnimated = true) {
	return `https://cdn.discordapp.com/icons/${id}/${hash}.${
		allowAnimated && hash.startsWith("a_") ? "gif" : "webp"
	}?size=${size}`;
}

/**
 * Resolves a Discord user avatar CDN URL.
 *
 * @param id - The ID of the user.
 * @param hash - The avatar hash.
 * @param size - The size for the avatar.
 * @param allowAnimated - Whether to allow animated avatars.
 */
export function userAvatarCdn(id: Snowflake, hash: string, size: ImageSizes, allowAnimated = true) {
	return `https://cdn.discordapp.com/avatars/${id}/${hash}.${
		allowAnimated && hash.startsWith("a_") ? "gif" : "webp"
	}?size=${size}`;
}

/**
 * Resolves a Discord user default avatar CDN URL.
 *
 * @param userData - The data for the user.
 * @param size - The size for the avatar.
 */
export function userDefaultAvatarCdn(
	{ discriminator, id }: Pick<UserContextData, "discriminator" | "id">,
	size: ImageSizes,
) {
	const index = discriminator === "0" ? Number(BigInt(id) >> BigInt(22)) % 6 : Number(discriminator) % 5;

	return `https://cdn.discordapp.com/avatars/${index}.webp?size=${size}`;
}
