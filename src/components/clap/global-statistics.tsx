import { Badge } from "@/components/ui/badge.tsx";
import { formatNumber } from "@/utils/format-number.ts";
import { formatToNearestOrderOfMagnitude } from "@/utils/format-to-nearest-order-of-magnitude.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export async function GlobalStatistics() {
	const globalStats = await getGlobalStats();

	const stats = [
		{
			name: "Servers",
			value: formatNumber(formatToNearestOrderOfMagnitude(globalStats.guildCount)),
			raw: globalStats.guildCount,
		},
		{
			name: "Members",
			value: formatNumber(formatToNearestOrderOfMagnitude(globalStats.memberCount)),
			raw: globalStats.memberCount,
		},
		{
			name: "Messages",
			value: formatNumber(formatToNearestOrderOfMagnitude(globalStats.messageCount)),
			raw: globalStats.messageCount,
		},
	] as const;

	return (
		<section aria-labelledby="features-title" className="mx-auto mt-44 flex w-full max-w-6xl flex-col px-3">
			<Badge>Community Engagement</Badge>

			<h2
				id="features-title"
				className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
			>
				Keep Your Community Active & Engaged
			</h2>

			<p className="mt-6 max-w-3xl text-gray-600 text-lg leading-7 dark:text-gray-400">
				Reward active members and spark conversations in your Discord server. With leveling, ranks, and fun engagement
				features, Lurkr helps create a vibrant community where everyone wants to participate.
			</p>

			<dl className="mt-12 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:border-gray-200 md:border-y md:py-14 dark:border-gray-800">
				{stats.map((stat) => (
					<div
						key={stat.name}
						className="border-indigo-100 border-l-2 pl-6 md:border-l md:text-center lg:border-gray-200 lg:first:border-none dark:border-indigo-900 lg:dark:border-gray-800"
					>
						<dd
							className="inline-block bg-gradient-to-t from-indigo-900 to-indigo-600 bg-clip-text font-bold text-5xl text-transparent tracking-tight lg:text-6xl dark:from-indigo-700 dark:to-indigo-400"
							title={`${stat.raw} ${stat.name}`}
						>
							{stat.value}
						</dd>

						<dt className="mt-1 text-gray-600 dark:text-gray-400">{stat.name}</dt>
					</div>
				))}
			</dl>
		</section>
	);
}

async function getGlobalStats() {
	const response = await makeApiRequest("/stats", null, {
		next: {
			revalidate: 6 * 60 * 60, // 6 hours
		},
	});

	if (!response.ok) {
		return {
			guildCount: 0,
			memberCount: 0,
			messageCount: 0,
			uptime: 0,
		};
	}

	const data = (await response.json()) as StatsResponse;
	return data;
}

interface StatsResponse {
	guildCount: number;
	memberCount: number;
	messageCount: number;
	uptime: number;
}
