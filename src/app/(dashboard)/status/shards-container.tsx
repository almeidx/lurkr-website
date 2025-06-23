"use client";

import { type ChangeEvent, useState } from "react";
import { Input } from "@/components/dashboard/Input.tsx";
import { ReportProblem } from "@/components/icons/mdi/report-problem.tsx";
import { getShardIdForGuildId } from "@/utils/get-shard-id-for-guild-id.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { type Shard, ShardDisplay } from "./shard.tsx";

export function ShardsContainer({ shards, totalShards }: ShardsContainerProps) {
	const [guildId, setGuildId] = useState("");

	const highlightedShard = guildId && isSnowflake(guildId) ? getShardIdForGuildId(guildId, totalShards) : null;

	function handleGuildIdChange(event: ChangeEvent<HTMLInputElement>) {
		setGuildId(event.target.value);
	}

	return (
		<>
			<Input
				className="w-full"
				id="serverId"
				maxLength={20}
				onChange={handleGuildIdChange}
				placeholder="Enter a server id…"
				value={guildId}
			/>

			<div className="flex w-full flex-wrap items-center justify-center gap-x-7.5 gap-y-5">
				{shards ? (
					shards.map((shard) => (
						<ShardDisplay key={`shard-${shard.shardId}`} {...shard} highlight={shard.shardId === highlightedShard} />
					))
				) : (
					<p className="flex items-center gap-2 font-bold text-xl">
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
