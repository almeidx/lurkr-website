import Image from "next/image";
import amariIcon from "@/assets/bots/amari.webp";
import mee6Icon from "@/assets/bots/mee6.svg";
import polarisIcon from "@/assets/bots/polaris.svg";
import levelCard from "@/assets/level-card.webp";
import logoSmall from "@/assets/logo-small.webp";
import { sc } from "./outfit.ts";
import { SectionHeading } from "./ui.tsx";
import { POLY_AMARI, POLY_LURKR, POLY_MEE6, Y50_AMARI, Y50_LURKR, Y50_MEE6 } from "./xp-chart.ts";

// ─── bento card wrapper ───────────────────────────────────────────────────────
function BentoCard({
	children,
	className = "",
	accent,
}: {
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly accent?: string;
}) {
	return (
		<div
			className={`relative overflow-hidden rounded-2xl border ${className}`}
			style={{
				background: "#1e1f22",
				borderColor: accent ? `${accent}28` : "rgba(255,255,255,0.07)",
			}}
		>
			{accent && (
				<div
					className="pointer-events-none absolute inset-x-0 top-0 h-40"
					style={{
						background: `radial-gradient(ellipse at 50% -10%, ${accent}18 0%, transparent 65%)`,
					}}
				/>
			)}
			{children}
		</div>
	);
}

// ─── bento card text area ─────────────────────────────────────────────────────
function BentoText({
	label,
	title,
	description,
}: {
	readonly label?: string;
	readonly title: string;
	readonly description: string;
}) {
	return (
		<div className="border-white/[0.07] border-t p-6">
			{label && (
				<span className="mb-1 block font-bold text-[10px] text-primary uppercase tracking-widest">{label}</span>
			)}
			<h3 className={`${sc} mb-2 font-bold text-lg text-white`}>{title}</h3>
			<p className="text-sm text-white/50 leading-relaxed">{description}</p>
		</div>
	);
}

export function FeaturesSection() {
	return (
		<section className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
			<div className="mb-14 flex flex-col items-center gap-4 text-center">
				<SectionHeading
					eyebrow="Features"
					gradientPart="Nothing locked away."
					subtitle="Every feature below is available to every server. Free. Always."
					title="Everything you need."
				/>
			</div>

			{/* Primary grid: 3 cols on lg */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* ── Card 1: Customizable Leveling System (wide) ── */}
				<BentoCard accent="#ff7077" className="lg:col-span-2">
					{/* XP Curve Chart */}
					<div className="relative h-56 overflow-hidden px-5 pt-5">
						{/* Bottom fade */}
						<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-linear-to-t from-darker to-transparent" />

						{/* Legend */}
						<div className="mb-3 flex items-center gap-5">
							{[
								{ color: "#ff7077", label: "Lurkr" },
								{ color: "#3fb950", label: "MEE6" },
								{ color: "#ff9500", label: "Amari" },
							].map(({ label, color }) => (
								<div className="flex items-center gap-1.5" key={label}>
									<div className="h-px w-5 rounded-full" style={{ background: color }} />
									<span className="font-semibold text-[10px]" style={{ color }}>
										{label}
									</span>
								</div>
							))}
							<span className="ml-auto text-[10px] text-white/25">XP / level →</span>
						</div>

						{/* Chart — polylines computed from exact preset formulas */}
						<svg fill="none" height="108" preserveAspectRatio="none" viewBox="0 0 420 108" width="100%">
							{/* Subtle grid */}
							{[27, 54, 81].map((y) => (
								<line
									key={y}
									stroke="rgba(255,255,255,0.05)"
									strokeDasharray="4 6"
									strokeWidth="1"
									x1="0"
									x2="420"
									y1={y}
									y2={y}
								/>
							))}

							{/* Amari — 20n²−40n+55 */}
							<polyline
								fill="none"
								opacity="0.7"
								points={POLY_AMARI}
								stroke="#ff9500"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
							/>

							{/* MEE6 — ≈(5/3)n³+(45/2)n²+(455/6)n */}
							<polyline
								fill="none"
								opacity="0.7"
								points={POLY_MEE6}
								stroke="#3fb950"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
							/>

							{/* Lurkr — 50n²−100n+150 (highlighted) */}
							<polyline
								fill="none"
								points={POLY_LURKR}
								stroke="#ff7077"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2.5"
								style={{ filter: "drop-shadow(0 0 5px rgba(255,112,119,0.55))" }}
							/>

							{/* Level-50 endpoint markers */}
							<circle cx="412" cy={Y50_LURKR} fill="#ff7077" r="3.5" />
							<circle cx="412" cy={Y50_MEE6} fill="#3fb950" r="2.5" />
							<circle cx="412" cy={Y50_AMARI} fill="#ff9500" r="2.5" />
						</svg>

						{/* X-axis labels */}
						<div className="-mt-0.5 flex justify-between px-1">
							<span className="text-[9px] text-white/25">Lv. 1</span>
							<span className="text-[9px] text-white/25">Lv. 25</span>
							<span className="text-[9px] text-white/25">Lv. 50</span>
						</div>
					</div>

					<BentoText
						description="Fine-tune your XP curve, set per-channel and per-role multipliers from 0.01× to 5×, and craft the exact progression your community deserves."
						label="Core Feature"
						title="Customizable Leveling System"
					/>
				</BentoCard>

				{/* ── Card 2: Import Any Bot ── */}
				<BentoCard accent="#60d1f6">
					<div className="relative flex h-56 flex-col justify-center gap-3 px-5 pt-5 pb-5">
						{/* Source bots — 3-column grid */}
						<div className="grid grid-cols-3 gap-2">
							{[
								{ color: "#3fb950", icon: mee6Icon, name: "MEE6" },
								{ color: "#ff9500", icon: amariIcon, name: "Amari" },
								{ color: "#5865f2", icon: polarisIcon, name: "Polaris" },
							].map(({ name, color, icon }) => (
								<div
									className="flex flex-col items-center gap-1.5 rounded-xl py-3"
									key={name}
									style={{ background: `${color}12`, border: `1px solid ${color}2a` }}
								>
									<Image alt={name} className="no-drag size-9 rounded-full" src={icon} />
									<span className="font-semibold text-[11px]" style={{ color }}>
										{name}
									</span>
								</div>
							))}
						</div>

						{/* Converge arrow */}
						<div className="flex flex-col items-center gap-0.5">
							<div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.15)" }} />
							<svg
								className="text-white/25"
								fill="none"
								height="14"
								stroke="currentColor"
								strokeWidth="1.5"
								viewBox="0 0 24 24"
								width="14"
							>
								<path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>

						{/* Lurkr destination */}
						<div
							className="flex items-center gap-3 rounded-xl px-4 py-3"
							style={{ background: "rgba(255,112,119,0.12)", border: "1px solid rgba(255,112,119,0.28)" }}
						>
							<Image
								alt="Lurkr"
								className="no-drag size-9 shrink-0 rounded-full"
								src={logoSmall}
								style={{ boxShadow: "0 0 12px rgba(255,112,119,0.5)" }}
							/>
							<div className="flex flex-col">
								<span className="font-bold text-sm text-white">Lurkr</span>
								<span className="text-[10px] text-green-400">✓ XP curve matched</span>
							</div>
						</div>
					</div>

					<BentoText
						description="Migrate your full leaderboard from MEE6, Amari, or Polaris — and seamlessly match their exact XP curve so progress feels right at home."
						title="Import Any Bot"
					/>
				</BentoCard>

				{/* ── Card 3: Custom Rank Cards ── */}
				<BentoCard accent="#7c6af5">
					{/* h-52 matches other cards; gradient fills the space around the full-width rank card */}
					<div className="relative flex h-52 items-center justify-center overflow-hidden px-5">
						<div
							className="pointer-events-none absolute inset-0"
							style={{
								background: "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(124,106,245,0.14) 0%, transparent 80%)",
							}}
						/>
						<Image
							alt="Lurkr rank card example"
							className="no-drag relative w-full rounded-2xl"
							sizes="50vw"
							src={levelCard}
							style={{
								boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,106,245,0.25)",
								height: "auto",
							}}
						/>
					</div>

					<BentoText
						description="Pick any background image and accent color — your rank card, your identity."
						title="Custom Rank Cards"
					/>
				</BentoCard>

				{/* ── Card 4: Custom Level Up Messages ── */}
				<BentoCard accent="#ff7077">
					<div className="relative flex h-52 items-center justify-center px-6 pt-7">
						{/* Mini Discord embed */}
						<div
							className="w-full max-w-62.5 overflow-hidden rounded"
							style={{ background: "#2b2d31", border: "1px solid rgba(255,255,255,0.06)" }}
						>
							<div className="flex">
								<div className="w-1 shrink-0" style={{ background: "#ff7077" }} />
								<div className="flex-1 p-3.5">
									<p className="font-semibold text-sm text-white">🎉 Level Up!</p>
									<p className="mt-1.5 text-[12px] leading-snug" style={{ color: "#dbdee1" }}>
										Congrats{" "}
										<span
											className="rounded px-1 font-medium text-[11px]"
											style={{ background: "#5865f222", color: "#8ab4f8" }}
										>
											{"{user}"}
										</span>{" "}
										— you reached{" "}
										<span className="font-bold" style={{ color: "#ffe87c" }}>
											level {"{level}"}
										</span>
										!
									</p>
									<p className="mt-2 text-[11px]" style={{ color: "#80848e" }}>
										Rank{" "}
										<span
											className="rounded px-1 font-medium text-[10px]"
											style={{ background: "#5865f222", color: "#8ab4f8" }}
										>
											#{"{rank}"}
										</span>{" "}
										on the leaderboard
									</p>
								</div>
							</div>
						</div>
					</div>

					<BentoText
						description="Send level-up announcements as plain text or a rich embed — with variables for username, level, rank, and more."
						title="Custom Level Up Messages"
					/>
				</BentoCard>

				{/* ── Card 5: Role Rewards ── */}
				<BentoCard accent="#ffe87c">
					<div className="relative flex h-52 flex-col items-center justify-center gap-3 px-6 pt-7">
						{[
							{ color: "#80848e", level: 5, role: "Newcomer" },
							{ color: "#5865f2", level: 25, role: "Champion" },
							{ color: "#ffe87c", level: 50, role: "Legend", star: true },
						].map(({ level, role, color, star }) => (
							<div className="flex w-full max-w-50 items-center gap-3" key={level}>
								<span className="w-16 shrink-0 text-right font-medium text-[10px] text-white/35">Level {level}</span>
								<div className="h-px flex-1" style={{ background: `${color}30` }} />
								<div
									className="flex items-center gap-1 rounded px-2.5 py-1 font-semibold text-xs"
									style={{ background: `${color}1e`, border: `1px solid ${color}3a`, color }}
								>
									{star && "⭐ "}
									{role}
								</div>
							</div>
						))}
					</div>

					<BentoText
						description="Automatically grant Discord roles as members hit level milestones. Stack up to 50 rewards — fully free."
						title="Role Rewards"
					/>
				</BentoCard>

				{/* ── Card 6: Public API (full-width) ── */}
				<BentoCard accent="#4ade80" className="md:col-span-2 lg:col-span-3">
					<div className="relative h-52 overflow-hidden px-5 pt-5">
						<div className="flex h-full gap-3">
							{/* Request panel */}
							<div
								className="flex-1 overflow-hidden rounded-xl font-mono text-[11px]"
								style={{ background: "#141517", border: "1px solid rgba(255,255,255,0.07)" }}
							>
								<div
									className="border-b px-3 py-1.5 text-[10px]"
									style={{ borderColor: "rgba(255,255,255,0.06)", color: "#6b7280" }}
								>
									request
								</div>
								<div className="space-y-1.5 p-3 leading-relaxed">
									<div>
										<span style={{ color: "#4ade80" }}>GET</span>
										<span style={{ color: "#93c5fd" }}> /v1/guilds/:id/members/:userId</span>
									</div>
									<div>
										<span style={{ color: "#6b7280" }}>Authorization: </span>
										<span style={{ color: "#fde68a" }}>Bearer lrk_••••••••••••••</span>
									</div>
								</div>
							</div>

							{/* Response panel */}
							<div
								className="flex-1 overflow-hidden rounded-xl font-mono text-[11px]"
								style={{ background: "#141517", border: "1px solid rgba(74,222,128,0.22)" }}
							>
								<div
									className="flex items-center gap-2 border-b px-3 py-1.5 text-[10px]"
									style={{ borderColor: "rgba(74,222,128,0.15)" }}
								>
									<span className="size-1.5 shrink-0 rounded-full" style={{ background: "#4ade80" }} />
									<span style={{ color: "#4ade80" }}>200 OK</span>
								</div>
								<div className="p-3 leading-relaxed">
									<div style={{ color: "#e2e8f0" }}>{"{"}</div>
									{(
										[
											{ key: "xp", value: "28152" },
											{ key: "level", value: "21" },
											{ key: "rank", value: "2" },
											{ key: "xpForNextLevel", value: "2253" },
										] as const
									).map(({ key, value }, i, arr) => (
										<div className="ml-3" key={key}>
											<span style={{ color: "#93c5fd" }}>"{key}"</span>
											<span style={{ color: "#e2e8f0" }}>: </span>
											<span style={{ color: "#fb923c" }}>{value}</span>
											{i < arr.length - 1 && <span style={{ color: "#e2e8f0" }}>,</span>}
										</div>
									))}
									<div style={{ color: "#e2e8f0" }}>{"}"}</div>
								</div>
							</div>
						</div>
					</div>

					<BentoText
						description="Generate an API key from your profile and read or write leveling data programmatically — build custom bots, dashboards, or integrations beyond what the dashboard supports."
						label="Developer"
						title="Public API"
					/>
				</BentoCard>
			</div>

			{/* Secondary row: 3 smaller feature cards */}
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{[
					{
						accent: "#ffe87c",
						description: "Celebrate member count milestones with role rewards and custom server announcements.",
						emoji: "🏆",
						title: "Milestones",
					},
					{
						accent: "#60d1f6",
						description: "Give your server a dedicated page where members can browse and copy every custom emoji.",
						emoji: "😄",
						title: "Emoji List",
					},
					{
						accent: "#a475b5",
						description: "Automatically publish new messages in announcement channels to all subscribed servers.",
						emoji: "📢",
						title: "Auto-Publish",
					},
				].map(({ emoji, title, description, accent }) => (
					<div
						className="flex flex-col gap-4 rounded-2xl border p-6"
						key={title}
						style={{
							background: "#1e1f22",
							borderColor: `${accent}22`,
						}}
					>
						<div
							className="flex size-11 items-center justify-center rounded-xl text-2xl"
							style={{ background: `${accent}16`, border: `1px solid ${accent}2e` }}
						>
							{emoji}
						</div>
						<div>
							<h3 className={`${sc} mb-1.5 font-bold text-lg text-white`}>{title}</h3>
							<p className="text-sm text-white/45 leading-relaxed">{description}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
