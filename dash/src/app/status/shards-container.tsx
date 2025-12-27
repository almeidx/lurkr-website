"use client";

import { SearchField } from "@heroui/react";
import { useState } from "react";
import { ReportProblem } from "@/components/icons/mdi/report-problem.tsx";
import { getShardIdForGuildId } from "@/utils/get-shard-id-for-guild-id.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { type Shard, ShardDisplay } from "./shard.tsx";

export function ShardsContainer({ shards, totalShards }: ShardsContainerProps) {
	const [guildId, setGuildId] = useState("");

	const highlightedShard = guildId && isSnowflake(guildId) ? getShardIdForGuildId(guildId, totalShards) : null;

	return (
		<>
			<SearchField aria-label="Find your shard" className="w-full max-w-md" onChange={setGuildId} value={guildId}>
				<SearchField.Group>
					<SearchField.SearchIcon />
					<SearchField.Input maxLength={19} minLength={16} placeholder="Enter a server id to find your shard…" />
					<SearchField.ClearButton isDisabled={guildId === ""} />
				</SearchField.Group>
			</SearchField>

			<div className="flex w-full flex-wrap items-center justify-center gap-x-7.5 gap-y-5">
				{shards ? (
					shards.map((shard) => (
						<ShardDisplay key={`shard-${shard.shardId}`} {...shard} highlight={shard.shardId === highlightedShard} />
					))
				) : (
					<div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
						<ReportProblem className="size-12 text-warning" />
						<p className="font-bold text-foreground text-xl">The bot is unreachable</p>
						<p>We are likely performing maintenance. Please check back later.</p>
					</div>
				)}
			</div>
		</>
	);
}

interface ShardsContainerProps {
	readonly shards: Shard[] | null;
	readonly totalShards: number;
}
