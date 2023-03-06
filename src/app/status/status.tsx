"use client";

import { useRef, useState } from "react";
import Message from "~/components/Message";
import Shard, { type GetBotStatisticsResponse } from "~/components/Shard";
import Input from "~/components/form/Input";
import { isValidSnowflake } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";

const tableHeaders = ["ID", "Guilds", "Users", "Ping (ms)", "Memory (MB)", "Uptime", "Last Updated"];

export function Status({ shards, totalShards }: GetBotStatisticsResponse) {
	const [serverId, setServerId] = useState<string>("");
	const [selectedShardId, setSelectedShardId] = useState<number | null>(null);
	const submitRef = useRef<HTMLButtonElement>(null);

	const now = Date.now();
	let timeout: NodeJS.Timeout | null = null;

	const handleServerIdSubmit = () => {
		if (isValidSnowflake(serverId)) {
			setSelectedShardId(calculateShardId(serverId, totalShards));
		} else {
			if (submitRef.current) {
				submitRef.current.style.color = "#ed4245";
			}

			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				if (submitRef.current) {
					submitRef.current.style.color = "#fff";
				}
			}, 1_000);
		}
	};

	return (
		<>
			<div className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
				<Input
					className="my-5"
					id="searchTerm"
					initialValue=""
					maxLength={20}
					onChange={(text) => {
						if (selectedShardId !== null) {
							setSelectedShardId(null);
						}

						setServerId(text);
					}}
					onSubmit={handleServerIdSubmit}
					placeholder="Enter a server ID"
					submitRef={submitRef}
				/>
			</div>

			<main className="mt-4 pb-2">
				{!shards && totalShards === null && <Message message="The bot is down" type="error" />}

				{typeof totalShards === "number" && (
					<span className="text-lg text-white">
						Shards: {shards?.length ?? 0}/{totalShards}
					</span>
				)}

				{Boolean(shards) && (
					<table className="gap-4 rounded-md bg-discord-not-quite-black text-white shadow-md">
						<thead>
							<tr>
								{tableHeaders.map((name, idx) => (
									<th className="py-3 px-5 text-lg" key={idx}>
										{name}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="text-center text-gray-300">
							{shards!.map(({ guilds, shardId, members, memory, ping, uptime, updatedAt }) => (
								<Shard
									guilds={guilds}
									key={shardId}
									members={members}
									memory={memory}
									now={now}
									ping={ping}
									selected={shardId === selectedShardId}
									shardId={shardId}
									updatedAt={updatedAt}
									uptime={uptime}
								/>
							))}
						</tbody>
					</table>
				)}
			</main>
		</>
	);
}

function calculateShardId(guildId: Snowflake, shards: number): number {
	return Number(BigInt(guildId) >> BigInt(22)) % shards;
}
