import type { Metadata } from "next";
import { Status } from "./status";
import type { GetBotStatisticsResponse } from "~/components/Shard";
import { API_BASE_URL } from "~/utils/constants";

async function getBotStatistics() {
	const response = await fetch(`${API_BASE_URL}/stats`, { next: { revalidate: 60 } });

	if (!response.ok) {
		throw new Error("Failed to fetch bot statistics");
	}

	return response.json() as Promise<GetBotStatisticsResponse>;
}

export default async function Page() {
	const { shards, totalShards } = await getBotStatistics();

	return (
		<div className="flex min-h-screen-no-footer flex-col items-center bg-discord-dark">
			<header className="my-4 mx-3 flex flex-col items-center gap-4 text-center sm:mx-0 sm:mb-6">
				<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">Bot Status</h1>
				<p className="font-light text-gray-400">Check if the bot is online in your server!</p>
			</header>

			<Status shards={shards} totalShards={totalShards} />
		</div>
	);
}

export const metadata: Metadata = {
	title: "Bot Status | Pepe Manager",
};
