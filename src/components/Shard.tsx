import ms from "@almeidx/ms";

export default function Shard({
	guilds,
	shardId,
	members,
	memory,
	ping,
	selected,
	uptime,
	updatedAt,
	now,
}: ShardProps) {
	return (
		<tr
			className={selected ? "animate-pulse" : ""}
			style={{ backgroundColor: selected ? "rgba(16, 185, 129, 0.5)" : "inherit" }}
		>
			<td className="py-3">{shardId.toLocaleString("en")}</td>
			<td>{guilds.toLocaleString("en")}</td>
			<td>{members.toLocaleString("en")}</td>
			<td>{ping.toLocaleString("en")}</td>
			<td>{memory.toLocaleString("en")}</td>
			<td>{uptime ? ms(uptime) : -1}</td>
			<td
				// Using this here since it relies on browser timings (Date.now()) and usually differs from pre-rendered HTML
				suppressHydrationWarning
			>
				{updatedAt ? ms(now - updatedAt) : -1}
			</td>
		</tr>
	);
}

type ShardProps = GetBotStatisticsResponse["shards"][number] & { now: number; selected: boolean };

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
