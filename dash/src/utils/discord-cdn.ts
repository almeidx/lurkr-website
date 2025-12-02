export function emojiImage(emojiId: Snowflake, animated: boolean) {
	return `https://cdn.discordapp.com/emojis/${emojiId}.${animated ? "gif" : "png"}`;
}

export function guildIcon(guildId: Snowflake, hash: string | null, { format = "png", size = 128 }: ImageOptions = {}) {
	if (!hash) return null;
	return `https://cdn.discordapp.com/icons/${guildId}/${hash}.${format}?size=${size}`;
}

export function userAvatar(userId: Snowflake, hash: string | null, { format = "png", size = 128 }: ImageOptions = {}) {
	if (!hash) return null;
	return `https://cdn.discordapp.com/avatars/${userId}/${hash}.${format}?size=${size}`;
}

/**
 * Normalizes an avatar hash by converting empty strings to null.
 * This is needed because the API may return empty strings instead of null for users without avatars.
 */
export function normalizeAvatar(avatar: string | null): string | null {
	return avatar === "" ? null : avatar;
}

export type Snowflake = string;

interface ImageOptions {
	format?: "gif" | "jpg" | "png" | "webp";
	size?: 1_024 | 2_048 | 4_096 | 16 | 32 | 64 | 128 | 256 | 512;
}
