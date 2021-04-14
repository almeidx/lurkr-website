import type { Snowflake } from 'discord-api-types';

/**
 * Resolves an emoji image url
 * @param id The Snowflake for the emoji
 * @param animated Whether this emoji is animated
 */
export const DISCORD_EMOJI_CDN = (id: Snowflake, animated: boolean) =>
  `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}?v=1`;

/**
 * Resolves a guild icon url
 * @param id The Snowflake for the guild
 * @param icon The icon hash
 */
export const DISCORD_GUILD_CDN = (id: Snowflake, icon: string | null, allowGif = true) =>
  icon
    ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.startsWith('a_') && allowGif ? 'gif' : 'webp'}?size=128`
    : null;

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://api.pepemanager.com';

export const FALLBACK_AVATAR = '/assets/fallback-avatar.png';
