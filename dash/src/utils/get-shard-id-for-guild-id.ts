import type { Snowflake } from "@/utils/discord-cdn.ts";

export function getShardIdForGuildId(guildId: Snowflake, shardCount: number) {
	// oxlint-disable-next-line unicorn/prefer-bigint-literals -- tsconfig targets ES2017, which does not allow BigInt literals
	return Number(BigInt(guildId) >> BigInt(22)) % shardCount;
}
