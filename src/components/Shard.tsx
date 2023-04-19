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
				className="invisible absolute -left-14 -top-32 z-50 w-40 rounded-lg bg-zinc-600 px-3 py-2 shadow-md group-hover:visible"
				role="tooltip"
			>
				<p className="text-white">{guilds.toLocaleString()} guilds</p>
				<p className="text-white">Members: {members.toLocaleString()}</p>
				<p className="text-white">Memory: {memory} MB</p>
				<p className="text-white">Ping: {ping} ms</p>
				<p className="text-white">Uptime: {uptime ? ms(uptime) : -1}</p>

				<div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-zinc-600 shadow-md" />
			</div>

			{shardId}
		</button>
	);
}

type ShardProps = Omit<GetBotStatisticsResponse["shards"][number], "updatedAt"> & { selected: boolean };
