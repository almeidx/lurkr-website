import { makeApiRequest } from "@/utils/make-api-request.ts";
import { IoWarning } from "@react-icons/all-files/io5/IoWarning";
import type { Metadata } from "next";
import type { Shard } from "./shard.tsx";
import { ShardsContainer } from "./shards-container.tsx";

export default async function Status() {
	const data = await getData();

	return (
		<div className="mx-2 flex flex-col items-center justify-center gap-12 py-4">
			<header className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-4xl font-bold text-white">Bot Status</h1>

				<p className="max-w-md text-center text-xl leading-relaxed tracking-tighter text-white/75">
					Check if the bot is online in your server or is currently having issues!
				</p>
			</header>

			<main className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 rounded-lg border bg-dark-gray px-[34px] py-8">
				{data ? (
					<ShardsContainer shards={data.shards} totalShards={data.totalShards} />
				) : (
					<p className="flex items-center gap-2 text-xl font-bold">
						<IoWarning className="text-yellow" />
						The bot is unreachable
					</p>
				)}
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Status",
	description: "Check if the bot is online in your server or is currently having issues!",
};

async function getData() {
	const response = await makeApiRequest("/status", null, {
		next: {
			revalidate: 30,
		},
	}).catch(() => undefined);

	if (!response?.ok) {
		return null;
	}

	return response.json() as Promise<StatusResponse>;
}

interface StatusResponse {
	shards: Shard[];
	totalShards: number;
}
