import ms from "@almeidx/ms";
import type { GetBotStatisticsResponse } from "~/pages/status";

export default function Shard({ guilds, shardId, members, memory, ping, selected, uptime }: ShardProps) {
	return (
		<button
			className={`${
				selected ? "bg-discord-green hover:bg-discord-green/75 animate-pulse" : "bg-blurple hover:bg-lighter-blurple"
			} group relative aspect-square w-12 rounded-lg px-4 py-3 text-center text-sm font-medium text-white transition-colors`}
			type="button"
		>
			<div
				className="bg-discord-lighter invisible absolute -left-14 -top-32 z-50 w-40 rounded-lg px-3 py-2 text-white shadow-md group-hover:visible"
				role="tooltip"
			>
				<p>{guilds.toLocaleString()} guilds</p>
				<p>Members: {members.toLocaleString()}</p>
				<p>Memory: {memory} MB</p>
				<p>Ping: {ping} ms</p>
				<p>Uptime: {uptime ? ms(uptime) : -1}</p>

				<div className="bg-discord-lighter absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 shadow-md" />
			</div>

			{shardId}
		</button>
	);
}

type ShardProps = GetBotStatisticsResponse["shards"][number] & { selected: boolean };
