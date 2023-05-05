import type { Metadata } from "next";
import { API_BASE_URL } from "../../utils/constants";
import { Shards } from "./shards";

export default async function Status() {
	const shards = await getShardData();

	return (
		<div className="min-h-screen-no-footer bg-discord-dark flex flex-col items-center">
			<header className="mx-3 my-4 flex flex-col items-center gap-4 text-center sm:mx-0 sm:mb-6">
				<h1 className="text-2xl font-bold text-white sm:text-4xl">Bot Status</h1>
				<p className="font-light text-gray-400">Check if the bot is online in your server!</p>
			</header>

			<Shards shards={shards.shards} totalShards={shards.totalShards} />
		</div>
	);
}

export const metadata: Metadata = {
	title: "Bot Status | Lurkr",
};

async function getShardData() {
	const res = await fetch(`${API_BASE_URL}/stats`, { next: { revalidate: 10 } });

	if (!res.ok) {
		throw new Error("The bot is unreachable");
	}

	return res.json() as Promise<GetBotStatisticsResponse>;
}

export interface GetBotStatisticsResponse {
	shards: {
		guilds: number;
		members: number;
		memory: number;
		ping: number;
		shardId: number;
		uptime: number;
	}[];
	totalShards: number;
}
