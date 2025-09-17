import type { Snowflake } from "@/utils/discord-cdn.ts";

/**
 * Check if a string is roughly a valid Discord snowflake.
 *
 * @param id - The string to check
 */
export function isSnowflake(id: string): id is Snowflake {
	return /^[1-9]\d{16,18}$/.test(id);
}
