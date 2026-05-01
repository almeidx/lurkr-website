import clsx from "clsx";
import { GradientText, SectionHeader } from "./shared.tsx";

const ROLES = [
	{ color: "#57f287", lvl: 5, role: "Regular", unlocked: true },
	{ color: "#ffe87c", lvl: 15, role: "Contributor", unlocked: true },
	{ color: "#ff7077", lvl: 30, role: "Veteran", unlocked: true },
	{ color: "#a475b5", lvl: 50, role: "Elite", unlocked: false },
	{ color: "#60d1f6", lvl: 75, role: "Legend", unlocked: false },
] as const;

export function FeatureRoleRewards() {
	return (
		<section className="mx-auto w-full max-w-[1400px] px-8 py-24 max-md:px-5 max-md:py-16">
			<div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
				<div>
					<SectionHeader
						desc="Stack roles at every level, sync on join, assign exclusive colours. Give active members a reason to stay."
						kicker="Progression"
						title={
							<>
								Reward activity with <GradientText italic>roles that unlock.</GradientText>
							</>
						}
					/>
				</div>

				<div className="flex flex-col gap-2.5 rounded-2xl border border-white/8 bg-linear-to-br from-[#1e1f22] to-[#232529] p-7 max-md:p-5">
					{ROLES.map((r) => (
						<div
							className={clsx(
								"flex items-center gap-3.5 rounded-xl border px-4 py-3 transition-opacity",
								r.unlocked ? "border-white/5 bg-white/3 opacity-100" : "border-white/3 bg-black/20 opacity-55",
							)}
							key={r.lvl}
						>
							<div
								className="flex size-11 shrink-0 flex-col items-center justify-center rounded-[10px] border font-extrabold text-[14px]"
								style={{
									background: `${r.color}22`,
									borderColor: `${r.color}55`,
									color: r.color,
								}}
							>
								<span className="text-[8px] opacity-80">LVL</span>
								<span className="text-[14px] leading-[1]">{r.lvl}</span>
							</div>
							<div
								aria-hidden
								className="size-2.5 shrink-0 rounded-full"
								style={{
									background: r.color,
									boxShadow: r.unlocked ? `0 0 8px ${r.color}` : "none",
								}}
							/>
							<span className="flex-1 font-semibold text-[15px]" style={{ color: r.color }}>
								@{r.role}
							</span>
							<span
								className={clsx(
									"font-semibold text-[11px] uppercase tracking-[0.5px]",
									r.unlocked ? "text-green" : "text-white/45",
								)}
							>
								{r.unlocked ? "Unlocked" : "Locked"}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
