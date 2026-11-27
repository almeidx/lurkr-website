import { is } from "valibot";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { vanitySchema } from "@/utils/schemas.ts";

/**
 * Whether the `entry` route param is a guild id or a vanity name. Check it before putting the param into an API path:
 * the param is attacker-controlled and the request carries credentials.
 *
 * Vanity names are stored in lowercase, but a mixed-case link is left for the API to resolve as before.
 */
export function isLeaderboardEntry(entry: string) {
	return is(vanitySchema, entry.toLowerCase()) || isSnowflake(entry);
}
