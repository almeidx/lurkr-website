"use client";

import clsx from "clsx";
import { useState } from "react";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { BOT_INVITE } from "@/shared-links.ts";
import { GradientText, SectionHeader } from "./shared.tsx";

const BOTS = [
	{ color: "#f5a623", id: "mee6", name: "MEE6" },
	{ color: "#60d1f6", id: "polaris", name: "Polaris" },
	{ color: "#a475b5", id: "arcane", name: "Arcane" },
	{ color: "#ff7077", id: "amari", name: "Amari" },
] as const;

type BotId = (typeof BOTS)[number]["id"];

export function FeatureImport() {
	const [from, setFrom] = useState<BotId>("mee6");
	const active = BOTS.find((b) => b.id === from)!;

	return (
		<section className="mx-auto w-full max-w-[1400px] px-8 py-24 max-md:px-5 max-md:py-16">
			<SectionHeader
				align="center"
				desc="One-click import from the big leveling bots. Your leaderboard shows up on day one."
				kicker="Migration"
				title={
					<>
						Walked away from paywalls. <GradientText>Brought everyone's XP.</GradientText>
					</>
				}
			/>

			<div className="mx-auto max-w-[720px] rounded-3xl border border-white/8 bg-linear-to-br from-[#1e1f22] to-[#232529] p-8 max-md:p-5">
				<div className="mb-3 font-bold text-[12px] text-white/45 uppercase tracking-[1px]">Import from</div>
				<div className="mb-7 flex flex-wrap gap-2">
					{BOTS.map((b) => (
						<button
							className={clsx(
								"rounded-xl border px-4 py-2.5 font-semibold text-[14px] transition-all",
								from === b.id ? "text-white" : "border-white/8 bg-white/2 text-white/70 hover:bg-white/5",
							)}
							key={b.id}
							onClick={() => setFrom(b.id)}
							style={
								from === b.id
									? {
											background: `${b.color}22`,
											borderColor: `${b.color}77`,
										}
									: undefined
							}
							type="button"
						>
							{b.name}
						</button>
					))}
				</div>

				<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 max-md:grid-cols-1">
					<div className="rounded-2xl border border-white/4 bg-black/25 px-6 py-5">
						<div className="font-semibold text-[11px] text-white/45 uppercase tracking-[1px]">From</div>
						<div className="mt-1 font-extrabold text-[22px] transition-colors" style={{ color: active.color }}>
							{active.name}
						</div>
						<div className="mt-2.5 text-[12px] text-white/45 tabular-nums">14,382 users · 2.4M XP</div>
					</div>

					<div className="flex size-10 items-center justify-center rounded-full bg-linear-(--lurkr-gradient) font-black text-[#1e1f22] text-[20px] max-md:rotate-90">
						→
					</div>

					<div className="rounded-2xl border border-primary/25 bg-primary/6 px-6 py-5">
						<div className="font-semibold text-[11px] text-white/45 uppercase tracking-[1px]">To</div>
						<div className="mt-1 bg-linear-(--lurkr-gradient) bg-clip-text font-extrabold text-[22px] text-transparent">
							Lurkr
						</div>
						<div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-green">
							<span className="size-1.5 rounded-full bg-green" />
							ready to import
						</div>
					</div>
				</div>

				<div className="mt-6 text-center">
					<ExternalLink
						className="inline-block rounded-xl bg-linear-(--lurkr-gradient) px-5 py-2.5 font-bold text-[#1e1f22] text-[14px] transition-transform hover:-translate-y-0.5"
						href={BOT_INVITE}
					>
						Begin import →
					</ExternalLink>
				</div>
			</div>
		</section>
	);
}
