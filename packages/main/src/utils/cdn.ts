import type { Snowflake } from 'discord-api-types';

type ImageSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

/**
 * Resolves a Discord guild icon CDN URL.
 * @param id The ID of the guild.
 * @param hash The icon hash.
 * @param size The size for the icon.
 */
export const guildIconCdn = (id: Snowflake, hash: string, size: ImageSizes) =>
  `https://cdn.discordapp.com/icons/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}?size=${size}`;

/**
 * Resolves a Discord emoji CDN URL.
 * @param id The ID of the emoji.
 * @param animated Whether the emoji is animated.
 */
export const emojiCdn = (id: Snowflake, animated: boolean) =>
  `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'webp'}?v=1`;
