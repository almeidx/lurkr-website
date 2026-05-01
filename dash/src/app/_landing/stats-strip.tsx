import { formatNumber } from "@/utils/format-number.ts";

interface StatsStripProps {
	readonly guildCount: number;
	readonly memberCount: number;
	readonly messageCount: number;
	readonly uptime: number;
}

export function StatsStrip({ guildCount, memberCount, messageCount, uptime }: StatsStripProps) {
	const stats = [
		{ label: "servers", value: `${formatNumber(guildCount, false)}+` },
		{ label: "members", value: `${formatNumber(memberCount, false)}+` },
		{ label: "uptime", value: `${formatNumber(uptime)}%` },
		{ label: "messages leveled", value: `${formatNumber(messageCount, false)}+` },
	];

	return (
		<section className="relative border-white/8 border-t border-b bg-linear-to-b from-primary/3 to-transparent">
			<div className="mx-auto grid w-full max-w-[1400px] grid-cols-4 gap-6 px-8 py-8 max-md:grid-cols-2 max-md:gap-4 max-md:p-6">
				{stats.map((stat, i) => (
					<div
						className="flex flex-col items-start border-white/5 max-md:border-0 md:not-first:border-l md:pl-6"
						key={stat.label}
						style={i === 0 ? { paddingLeft: 0 } : undefined}
					>
						<span className="bg-linear-to-r from-white to-white/55 bg-clip-text font-extrabold text-[clamp(2rem,4vw,3.5rem)] text-transparent tabular-nums leading-[1] tracking-[-0.03em]">
							{stat.value}
						</span>
						<span className="mt-2 font-medium text-[13px] text-white/45 uppercase tracking-[1px]">{stat.label}</span>
					</div>
				))}
			</div>
		</section>
	);
}
