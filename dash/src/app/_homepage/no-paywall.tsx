import Link from "next/link";
import { sc } from "./outfit.ts";
import { ArrowRight, SectionHeading } from "./ui.tsx";

const FREE_ITEMS = [
	"Unlimited leveling for all members",
	"Customizable XP curves & progressions",
	"Per-channel and per-role multipliers",
	"Up to 50 role rewards per server",
	"Fully custom rank card colors",
	"Custom level up messages & variables",
	"Import from MEE6, Amari & Polaris",
	"All slash commands & leaderboards",
];

const PREMIUM_ITEMS = [
	"Up to 100 role rewards (vs 50 free)",
	"Up to 25 XP multipliers (vs 5 free)",
	"Higher leaderboard display counts",
	"No tips shown in /rank command",
	"Early access to new features",
	"Premium support channel access",
	"Exclusive Patreon supporter role",
];

export function NoPaywallSection() {
	return (
		<section
			className="relative overflow-hidden"
			style={{
				background:
					"linear-gradient(180deg, rgba(255,112,119,0.04) 0%, rgba(255,232,124,0.025) 50%, rgba(255,112,119,0.04) 100%)",
				borderBottom: "1px solid rgba(255,112,119,0.14)",
				borderTop: "1px solid rgba(255,112,119,0.14)",
			}}
		>
			{/* Decorative blob */}
			<div
				className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
				style={{
					background: "radial-gradient(circle, rgba(255,112,119,0.07) 0%, transparent 65%)",
					filter: "blur(80px)",
					height: "min(80vw, 900px)",
					width: "min(80vw, 900px)",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
				<div className="mb-14 flex flex-col items-center gap-4 text-center">
					<SectionHeading
						eyebrow="Our Philosophy"
						gradientPart="Free. Forever."
						subtitle="We think paywalling core features is fundamentally wrong. Premium exists to support us and offer higher configuration limits — never to restrict what your server can do."
						title="Every feature."
					/>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Always Free */}
					<div className="rounded-2xl border p-8" style={{ background: "#1e1f22", borderColor: "rgba(62,162,94,0.2)" }}>
						<div className="mb-6 flex items-center gap-3">
							<div
								className="flex size-10 items-center justify-center rounded-xl text-base"
								style={{ background: "rgba(62,162,94,0.15)", border: "1px solid rgba(62,162,94,0.3)" }}
							>
								✓
							</div>
							<h3 className={`${sc} font-bold text-white text-xl`}>Always Free</h3>
						</div>
						<ul className="flex flex-col gap-3.5">
							{FREE_ITEMS.map((item) => (
								<li className="flex items-center gap-3 text-sm text-white/65" key={item}>
									<div className="size-1.5 shrink-0 rounded-full" style={{ background: "#3ea25e" }} />
									{item}
								</li>
							))}
						</ul>
					</div>

					{/* Premium adds */}
					<div
						className="rounded-2xl border p-8"
						style={{
							background: "linear-gradient(145deg, #1e1f22 0%, #221c1d 100%)",
							borderColor: "rgba(255,112,119,0.22)",
						}}
					>
						<div className="mb-6 flex items-center gap-3">
							<div
								className="flex size-10 items-center justify-center rounded-xl text-base"
								style={{ background: "rgba(255,112,119,0.15)", border: "1px solid rgba(255,112,119,0.3)" }}
							>
								★
							</div>
							<div>
								<h3 className={`${sc} font-bold text-white text-xl`}>Premium Adds</h3>
								<span className="text-white/35 text-xs">Higher limits, not restricted features</span>
							</div>
						</div>
						<ul className="flex flex-col gap-3.5">
							{PREMIUM_ITEMS.map((item) => (
								<li className="flex items-center gap-3 text-sm text-white/65" key={item}>
									<div className="size-1.5 shrink-0 rounded-full" style={{ background: "#ff7077" }} />
									{item}
								</li>
							))}
						</ul>
						<div className="mt-8 border-white/[0.07] border-t pt-6">
							<Link
								className="inline-flex items-center gap-2 font-semibold text-primary text-sm transition-opacity hover:opacity-70"
								href="/premium"
							>
								View premium plans
								<ArrowRight className="size-3.5" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
