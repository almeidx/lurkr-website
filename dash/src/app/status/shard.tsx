import { Tooltip } from "@heroui/react";
import clsx from "clsx";
import { prettySeconds } from "@/utils/pretty-seconds.ts";

export function ShardDisplay({ guilds, members, ping, shardId, uptime, highlight }: ShardDisplayProps) {
	const isHighPing = ping > 200;

	return (
		<Tooltip delay={0}>
			<Tooltip.Trigger className="focus:outline-none">
				<div
					className={clsx(
						"relative flex size-14 cursor-default items-center justify-center rounded-2xl border transition-all duration-300",
						highlight
							? "scale-105 border-2 border-primary bg-white/5 shadow-lg shadow-primary/20"
							: "border-white/5 bg-white/5 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-black/50 hover:shadow-lg",
					)}
				>
					{/* Status Glow (Background) */}
					<div
						className={clsx(
							"absolute inset-0 rounded-2xl opacity-20 blur-md transition-opacity duration-500",
							isHighPing ? "bg-warning" : "bg-success",
							highlight ? "opacity-0" : "opacity-0 group-hover:opacity-20",
						)}
					/>

					{/* Status Dot */}
					<div
						className={clsx(
							"absolute top-1.5 right-1.5 size-2 rounded-full shadow-sm",
							isHighPing ? "bg-warning shadow-warning/50" : "bg-success shadow-success/50",
							highlight && "animate-pulse",
						)}
					/>

					<span className={clsx("font-bold text-xl", highlight ? "text-primary" : "text-white/80")}>{shardId}</span>
				</div>
			</Tooltip.Trigger>

			<Tooltip.Content>
				<div className="px-1 py-1">
					<div className="flex items-center gap-2 font-bold text-small">
						<div className={clsx("size-2 rounded-full", isHighPing ? "bg-warning" : "bg-success")} />
						Shard {shardId}
					</div>
					<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-tiny">
						<span>Guilds:</span>
						<span className="text-right text-foreground">{guilds.toLocaleString()}</span>
						<span>Members:</span>
						<span className="text-right text-foreground">{members.toLocaleString()}</span>
						<span>Ping:</span>
						<span className={clsx("text-right", isHighPing ? "text-warning" : "text-success")}>{ping}ms</span>
						<span>Uptime:</span>
						<span className="text-right text-foreground">{prettySeconds(Math.trunc(uptime / 1_000))}</span>
					</div>
				</div>
			</Tooltip.Content>
		</Tooltip>
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
