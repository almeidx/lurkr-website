import type { Metadata } from "next";
import { ReportProblem } from "@/components/icons/mdi/report-problem.tsx";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Shard } from "./shard.tsx";
import { ShardsContainer } from "./shards-container.tsx";

export default async function Status() {
	const data = await getData();

	return (
		<div className="mx-2 flex flex-col items-center justify-center gap-12 py-4">
			<header className="flex flex-col items-center justify-center gap-4">
				<h1 className="font-bold text-4xl text-white">Bot Status</h1>

				<p className="max-w-md text-center text-white/75 text-xl leading-relaxed tracking-tighter">
					Check if the bot is online in your server or is currently having issues!
				</p>
			</header>

			<main className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 rounded-lg border border-white/25 bg-dark-gray px-8.5 py-8">
				{data ? (
					<ShardsContainer shards={data.shards} totalShards={data.totalShards} />
				) : (
					<p className="flex items-center gap-2 font-bold text-xl">
						<ReportProblem className="text-yellow" />
						The bot is unreachable
					</p>
				)}
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Check if the bot is online in your server or is currently having issues!",
	title: "Status",
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
