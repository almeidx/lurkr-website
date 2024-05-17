"use client";

import { Input } from "@/components/dashboard/Input.tsx";
import { getShardIdForGuildId } from "@/utils/get-shard-id-for-guild-id.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { ReportProblem } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { type Shard, ShardDisplay } from "./shard.tsx";

export function ShardsContainer({ shards, totalShards }: ShardsContainerProps) {
	const [guildId, setGuildId] = useState("");

	const highlightedShard = useMemo(
		() => (guildId && isSnowflake(guildId) ? getShardIdForGuildId(guildId, totalShards) : null),
		[totalShards, guildId],
	);

	return (
		<>
			<Input
				className="w-full"
				id="serverId"
				placeholder="Enter a server id…"
				value={guildId}
				onChange={(event) => setGuildId(event.target.value)}
				maxLength={20}
			/>

			<div className="flex w-full flex-wrap items-center justify-center gap-x-[29px] gap-y-5">
				{shards ? (
					shards.map((shard) => (
						<ShardDisplay key={`shard-${shard.shardId}`} {...shard} highlight={shard.shardId === highlightedShard} />
					))
				) : (
					<p className="flex items-center gap-2 text-xl font-bold">
						<ReportProblem className="text-yellow" />
						The bot is unreachable
					</p>
				)}
			</div>
		</>
	);
}

interface ShardsContainerProps {
	readonly shards: Shard[] | null;
	readonly totalShards: number;
}
