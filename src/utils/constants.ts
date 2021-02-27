export type Snowflake = string;

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
export const DISCORD_GUILD_CDN = (id: Snowflake, icon: string) =>
  `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.startsWith('a_') ? 'gif' : 'webp'}?size=128`;

export const API_BASE_URL = 'https://api.pepe-is.life' as const;
