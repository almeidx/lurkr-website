import { GradientText, SectionHeader } from "./shared.tsx";

const MULTIPLIERS = [
	{ color: "#ff7077", label: "#weekend-events", mult: "3.0×", type: "Channel" },
	{ color: "#eb459e", label: "@Booster", mult: "2.0×", type: "Role" },
	{ color: "#ffe87c", label: "Server-wide boost", mult: "1.5×", type: "Global" },
	{ color: "#a475b5", label: "@Server Booster", mult: "1.25×", type: "Role" },
	{ color: "#60d1f6", label: "#off-topic", mult: "0.5×", type: "Channel" },
] as const;

export function FeatureMultipliers() {
	return (
		<section className="bg-[radial-gradient(ellipse_at_top,rgba(164,117,181,0.08),transparent_60%)] px-8 py-24 max-md:px-5 max-md:py-16">
			<div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
				<div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-linear-to-br from-[#1e1f22] to-[#232529] p-7 max-md:p-5">
					{MULTIPLIERS.map((m) => (
						<div
							className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/2 px-4 py-3.5"
							key={m.label}
						>
							<span
								className="min-w-[54px] font-bold text-[10px] uppercase tracking-[0.5px]"
								style={{ color: m.color }}
							>
								{m.type}
							</span>
							<span className="flex-1 font-medium font-mono text-[14px] text-white">{m.label}</span>
							<span
								className="bg-clip-text font-extrabold text-[22px] text-transparent tabular-nums"
								style={{
									backgroundImage: `linear-gradient(92deg, ${m.color}, #ffe87c)`,
								}}
							>
								{m.mult}
							</span>
						</div>
					))}
				</div>

				<div>
					<SectionHeader
						desc="Global, channel, and role multipliers — stack them however you like. Boost an event channel, dampen spam chats, reward supporters without hand-editing XP."
						kicker="Fine control"
						title={
							<>
								Tune XP <GradientText italic>per channel, per role.</GradientText>
							</>
						}
					/>
				</div>
			</div>
		</section>
	);
}
