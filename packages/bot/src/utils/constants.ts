import type { Snowflake } from 'discord-api-types';

/**
 * Resolves a guild icon url
 * @param id The Snowflake for the guild
 * @param icon The icon hash
 */
export const DISCORD_GUILD_CDN = (id: Snowflake, icon: string | null, allowGif = true) =>
  icon
    ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.startsWith('a_') && allowGif ? 'gif' : 'webp'}?size=128`
    : null;

/**
 * Resolves a user avatar url
 * @param id The Snowflake for the user
 * @param hash The avatar hash
 */
export const DISCORD_USER_AVATAR_CDN = (id: Snowflake, hash: string) =>
  `https://cdn.discordapp.com/avatars/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}`;

/**
 * Resolves a user default avatar url
 * @param discriminator The discriminator for the user
 */
export const DISCORD_USER_DEFAULT_AVATAR_CDN = (discriminator: number) =>
  `'https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png`;

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://api.pepemanager.com';

// https://discord.com/developers/docs/reference#snowflakes
export const MIN_SNOWFLAKE = 0b000000000000000000000000000000000000000000_00001_00001_000000000001;

// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
export const MAX_SNOWFLAKE = BigInt('0b1111111111111111111111111111111111111111111111111111111111111111');

export const FALLBACK_AVATAR = '/static/fallback-avatar.png';
