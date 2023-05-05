"use client";

import { useRef, useState } from "react";
import type { GetBotStatisticsResponse } from "./page";
import Message from "~/components/Message";
import Shard from "~/components/Shard";
import Input from "~/components/form/Input";
import { isValidSnowflake } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";

export function Shards({ shards, totalShards, fatal }: GetBotStatisticsResponse & { fatal: boolean }) {
	const [serverId, setServerId] = useState<string>("");
	const [selectedShardId, setSelectedShardId] = useState<number | null>(null);
	const submitRef = useRef<HTMLButtonElement>(null);

	let timeout: NodeJS.Timeout | null = null;

	const handleServerIdSubmit = () => {
		if (isValidSnowflake(serverId)) {
			setSelectedShardId(calculateShardId(serverId, totalShards ?? 1));
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
				{shards.length ? (
					<Input
						buttonType="submit"
						className="my-5"
						id="searchTerm"
						initialValue=""
						maxLength={20}
						onChange={(text) => {
							if (selectedShardId !== null) setSelectedShardId(null);
							setServerId(text);
						}}
						onSubmit={handleServerIdSubmit}
						placeholder="Enter a server ID"
						submitRef={submitRef}
					/>
				) : null}
			</div>

			<main className="mt-4">
				{totalShards === -1 ? (
					<Message message={fatal ? "The bot is unreachable" : "The bot is unavailable"} type="error" />
				) : null}

				{fatal ? null : (
					<span className="text-lg text-white">
						Shards: {shards?.length ?? 0}/{totalShards}
					</span>
				)}

				{shards.length ? (
					<div className="mt-6 grid grid-cols-5 gap-2 md:grid-cols-12">
						{shards.map(({ shardId, ...shard }) => (
							<Shard key={shardId} selected={shardId === selectedShardId} shardId={shardId} {...shard} />
						))}
					</div>
				) : null}
			</main>
		</>
	);
}

function calculateShardId(guildId: Snowflake, shards: number): number {
	return Number(BigInt(guildId) >> BigInt(22)) % shards;
}
