"use client";

import clsx from "clsx";
import { useState } from "react";
import { RankCardMock } from "./rank-card-mock.tsx";
import { GradientText, SectionHeader } from "./shared.tsx";

const PALETTE = [
	{ color: "#ff7077", label: "coral" },
	{ color: "#ffe87c", label: "amber" },
	{ color: "#57f287", label: "mint" },
	{ color: "#5865f2", label: "blurple" },
	{ color: "#eb459e", label: "pink" },
	{ color: "#a475b5", label: "plum" },
] as const;

const BACKGROUNDS = ["default", "sunset", "midnight"] as const;

const FEATURES = [
	{ desc: "Any hex colour you want", title: "Custom accent" },
	{ desc: "Your art, your aesthetic", title: "Upload a background" },
	{ desc: "One command, instant card", title: "/rank anywhere" },
	{
		desc: "Hide from public web leaderboards at will",
		title: "Privacy toggle",
	},
] as const;

export function FeatureRankCard() {
	const [accent, setAccent] = useState<string>("#ff7077");
	const [bg, setBg] = useState<(typeof BACKGROUNDS)[number]>("default");

	return (
		<section className="bg-linear-to-b from-transparent via-primary/3 to-transparent px-8 py-24 max-md:px-5 max-md:py-16">
			<div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
				<div className="flex flex-col gap-5 rounded-3xl border border-white/6 bg-[radial-gradient(circle_at_30%_30%,rgba(255,112,119,0.12),transparent_60%)] p-12 max-md:p-6">
					<RankCardMock accent={accent} bg={bg} />

					<div className="flex flex-wrap items-center gap-2.5">
						<span className="font-bold text-[11px] text-white/45 uppercase tracking-[1px]">Accent</span>
						{PALETTE.map((p) => (
							<button
								aria-label={p.label}
								className={clsx(
									"size-6 rounded-full border-2 p-0 outline-none transition-all",
									accent === p.color ? "border-white" : "border-white/10 hover:border-white/30",
								)}
								key={p.color}
								onClick={() => setAccent(p.color)}
								style={{ background: p.color }}
								type="button"
							/>
						))}

						<span aria-hidden className="mx-1.5 block h-5 w-px bg-white/10" />

						<span className="font-bold text-[11px] text-white/45 uppercase tracking-[1px]">Bg</span>
						{BACKGROUNDS.map((b) => (
							<button
								className={clsx(
									"rounded-md border border-white/10 px-2.5 py-1 font-semibold text-[11px] text-white/85 capitalize transition-all",
									bg === b ? "bg-white/10" : "bg-transparent hover:bg-white/5",
								)}
								key={b}
								onClick={() => setBg(b)}
								type="button"
							>
								{b}
							</button>
						))}
					</div>
				</div>

				<div>
					<SectionHeader
						desc={
							<>
								Every member picks their own accent colour and background. No awkward template — their vibe, their card.
								Try the picker →
							</>
						}
						kicker="Identity"
						title={
							<>
								Rank cards that <GradientText italic>look like you.</GradientText>
							</>
						}
					/>

					<div className="mt-2 grid grid-cols-2 gap-3 max-xs:grid-cols-1">
						{FEATURES.map((f) => (
							<div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3.5" key={f.title}>
								<div className="mb-0.5 font-semibold text-[14px] text-white">{f.title}</div>
								<div className="text-[12px] text-white/45 leading-[1.4]">{f.desc}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
