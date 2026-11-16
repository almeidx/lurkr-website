import type { Snowflake } from "@/utils/discord-cdn.ts";

/** Roughly matches a Discord snowflake. */
export const SNOWFLAKE_REGEX = /^[1-9]\d{16,18}$/;

export function isSnowflake(id: string): id is Snowflake {
	return SNOWFLAKE_REGEX.test(id);
}
