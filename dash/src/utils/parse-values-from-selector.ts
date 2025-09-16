import type { Snowflake } from "@/utils/discord-cdn.ts";

/**
 * Parse values from the dummy input which is used to store the selected channel or role ids.
 *
 * @remarks
 * The values are separated by a comma.
 * @param value - The value of the dummy input
 */
export function parseValuesFromSelector(value: string): Snowflake[] {
	if (!value) return [];
	return value.split(",").filter(Boolean);
}
