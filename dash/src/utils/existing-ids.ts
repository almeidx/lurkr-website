import type { Snowflake } from "@/utils/discord-cdn.ts";

export function existingIds(ids: readonly Snowflake[], known: readonly { id: Snowflake }[]) {
	return ids.filter((id) => known.some((item) => item.id === id));
}
