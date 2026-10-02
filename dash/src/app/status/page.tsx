import type { Metadata } from "next";
import { ReportProblem } from "@/components/icons/mdi/report-problem.tsx";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Shard } from "./shard.tsx";
import { ShardsContainer } from "./shards-container.tsx";

export default async function Status() {
	const data = await getData();

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-4 py-12">
			<header className="flex flex-col items-center justify-center gap-4 text-center">
				<h1 className="bg-linear-to-br from-white to-white/50 bg-clip-text text-4xl font-bold text-transparent">
					Bot Status
				</h1>

				<p className="max-w-lg text-center text-xl leading-relaxed tracking-tight text-white/80">
					Check if the bot is online or having issues in your server!
				</p>
			</header>

			<div className="flex w-full flex-col items-center gap-10">
				{data ? (
					<ShardsContainer shards={data.shards} totalShards={data.totalShards} />
				) : (
					<div className="flex flex-col items-center justify-center gap-4 text-center">
						<ReportProblem className="size-16 animate-pulse text-warning" />
						<p className="text-2xl font-bold text-foreground">The bot is unreachable</p>
						<p>We are having trouble connecting to the bot API.</p>
					</div>
				)}
			</div>
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
	}).catch(() => {});

	if (!response?.ok) {
		return null;
	}

	return response.json() as Promise<StatusResponse>;
}

interface StatusResponse {
	shards: Shard[];
	totalShards: number;
}
