import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import Message from "~/components/Message";
import Shard from "~/components/Shard";
import Input from "~/components/form/Input";
import { isValidSnowflake } from "~/utils/common";
import { type Snowflake, API_BASE_URL } from "~/utils/constants";

const tableHeaders = ["ID", "Guilds", "Users", "Ping (ms)", "Memory (MB)", "Uptime", "Last Updated"];

export const getStaticProps = (async () => {
	const response = await fetch(`${API_BASE_URL}/stats`).catch(() => null);
	const data = (await response?.json().catch(() => null)) as GetBotStatisticsResponse | null;

	return {
		props: {
			shards: data?.shards ?? null,
			totalShards: data?.totalShards ?? null,
		},
		revalidate: 2,
	};
}) satisfies GetStaticProps;

export default function Status({ shards, totalShards }: InferGetStaticPropsType<typeof getStaticProps>) {
	const [serverId, setServerId] = useState<string>("");
	const [selectedShardId, setSelectedShardId] = useState<number | null>(null);
	const submitRef = useRef<HTMLButtonElement>(null);

	const now = Date.now();
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
		<div className="flex min-h-screen-no-footer flex-col items-center bg-discord-dark">
			<Head>
				<title>Bot Status | Lurkr</title>
			</Head>

			<header className="my-4 mx-3 flex flex-col items-center gap-4 text-center sm:mx-0 sm:mb-6">
				<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">Bot Status</h1>
				<p className="font-light text-gray-400">Check if the bot is online in your server!</p>
			</header>

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

			<main className="mt-4">
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
		</div>
	);
}

function calculateShardId(guildId: Snowflake, shards: number): number {
	return Number(BigInt(guildId) >> BigInt(22)) % shards;
}

export interface GetBotStatisticsResponse {
	shards: {
		guilds: number;
		members: number;
		memory: number;
		ping: number;
		shardId: number;
		updatedAt: number;
		uptime: number;
	}[];
	totalShards: number;
}
