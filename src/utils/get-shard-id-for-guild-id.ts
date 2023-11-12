import type { Snowflake } from "@/utils/discord-cdn.ts";

export function getShardIdForGuildId(guildId: Snowflake, shardCount: number) {
	return Number(BigInt(guildId) >> BigInt(22)) % shardCount;
}
