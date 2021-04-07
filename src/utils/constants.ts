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
  process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://api.pepe-is.life';

// https://discord.com/developers/docs/reference#snowflakes
export const MIN_SNOWFLAKE = 0b000000000000000000000000000000000000000000_00001_00001_000000000001;

// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
export const MAX_SNOWFLAKE = BigInt('0b1111111111111111111111111111111111111111111111111111111111111111');

export const FALLBACK_AVATAR = '/assets/fallback-avatar.png';

export const DISCORD_API_BASE_URL = 'https://discord.com/api';

/* eslint-disable sort-keys */
export const DISCORD_PERMISSIONS = {
  CREATE_INSTANT_INVITE: BigInt(1) << BigInt(0),
  KICK_MEMBERS: BigInt(1) << BigInt(1),
  BAN_MEMBERS: BigInt(1) << BigInt(2),
  ADMINISTRATOR: BigInt(1) << BigInt(3),
  MANAGE_CHANNELS: BigInt(1) << BigInt(4),
  MANAGE_GUILD: BigInt(1) << BigInt(5),
  ADD_REACTIONS: BigInt(1) << BigInt(6),
  VIEW_AUDIT_LOG: BigInt(1) << BigInt(7),
  PRIORITY_SPEAKER: BigInt(1) << BigInt(8),
  STREAM: BigInt(1) << BigInt(9),
  VIEW_CHANNEL: BigInt(1) << BigInt(10),
  SEND_MESSAGES: BigInt(1) << BigInt(11),
  SEND_TTS_MESSAGES: BigInt(1) << BigInt(12),
  MANAGE_MESSAGES: BigInt(1) << BigInt(13),
  EMBED_LINKS: BigInt(1) << BigInt(14),
  ATTACH_FILES: BigInt(1) << BigInt(15),
  READ_MESSAGE_HISTORY: BigInt(1) << BigInt(16),
  MENTION_EVERYONE: BigInt(1) << BigInt(17),
  USE_EXTERNAL_EMOJIS: BigInt(1) << BigInt(18),
  VIEW_GUILD_INSIGHTS: BigInt(1) << BigInt(19),
  CONNECT: BigInt(1) << BigInt(20),
  SPEAK: BigInt(1) << BigInt(21),
  MUTE_MEMBERS: BigInt(1) << BigInt(22),
  DEAFEN_MEMBERS: BigInt(1) << BigInt(23),
  MOVE_MEMBERS: BigInt(1) << BigInt(24),
  USE_VAD: BigInt(1) << BigInt(25),
  CHANGE_NICKNAME: BigInt(1) << BigInt(26),
  MANAGE_NICKNAMES: BigInt(1) << BigInt(27),
  MANAGE_ROLES: BigInt(1) << BigInt(28),
  MANAGE_WEBHOOKS: BigInt(1) << BigInt(29),
  MANAGE_EMOJIS: BigInt(1) << BigInt(30),
};
/* eslint-enable sort-keys */
