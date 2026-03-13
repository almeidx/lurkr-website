import { formatNumber } from "@/utils/format-number.ts";
import { sc } from "./outfit.ts";

interface StatsSectionProps {
	readonly guildCount: number;
	readonly memberCount: number;
	readonly messageCount: number;
	readonly uptime: number;
}

export function StatsSection({ guildCount, memberCount, messageCount, uptime }: StatsSectionProps) {
	const stats = [
		{ label: "Servers", suffix: "+", value: formatNumber(guildCount, false) },
		{ label: "Members", suffix: "+", value: formatNumber(memberCount, false) },
		{ label: "Uptime", suffix: "%", value: formatNumber(uptime) },
		{ label: "Messages", suffix: "+", value: formatNumber(messageCount, false) },
	];

	return (
		<section className="border-white/[0.07] border-y" style={{ background: "rgba(30,31,34,0.55)" }}>
			<div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
				{stats.map(({ value, suffix, label }) => (
					<div className="flex flex-col items-center justify-center gap-1 py-10 text-center" key={label}>
						<div className={`${sc} flex items-baseline gap-0.5`}>
							<span className="font-extrabold text-[2.6rem] text-gradient-lurkr leading-none lg:text-[3.2rem]">
								{value}
							</span>
							<span className="font-bold text-2xl text-gradient-lurkr lg:text-3xl">{suffix}</span>
						</div>
						<span className="font-medium text-sm text-white/45">{label}</span>
					</div>
				))}
			</div>
		</section>
	);
}
