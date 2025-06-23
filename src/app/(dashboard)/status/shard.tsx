import { Tooltip, TooltipAnchor, TooltipProvider } from "@ariakit/react";
import clsx from "clsx";
import { prettySeconds } from "@/utils/pretty-seconds.ts";

export function ShardDisplay({ guilds, members, ping, shardId, uptime, highlight }: ShardDisplayProps) {
	return (
		<TooltipProvider showTimeout={150}>
			<TooltipAnchor
				className={clsx(
					"flex size-12.5 items-center justify-center rounded-lg border border-white/25 font-bold text-4xl",
					highlight ? "animate-pulse-success hover:animate-none" : "bg-darker",
				)}
			>
				{shardId}
			</TooltipAnchor>

			<Tooltip className="max-w-xs whitespace-pre-wrap rounded-lg border border-white/25 bg-background px-3 py-2 text-center leading-relaxed tracking-tight md:max-w-prose">
				{guilds.toLocaleString()} guilds{"\n"}
				{members.toLocaleString()} members{"\n"}
				{ping}ms ping{"\n"}
				{prettySeconds(Math.trunc(uptime / 1_000))} uptime
			</Tooltip>
		</TooltipProvider>
	);
}

type ShardDisplayProps = Shard & {
	readonly highlight: boolean;
};

export interface Shard {
	readonly guilds: number;
	readonly members: number;
	readonly ping: number;
	readonly shardId: number;
	readonly uptime: number;
}
