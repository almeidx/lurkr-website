import Link from "next/link";
import { DiscordChatMockup } from "@/components/DiscordChatMockup.tsx";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { BOT_INVITE } from "@/shared-links.ts";
import { sc } from "./outfit.ts";
import { ArrowRight, DiscordIcon, Eyebrow } from "./ui.tsx";

export function HeroSection() {
	return (
		<section className="relative flex min-h-[75vh] items-center md:min-h-[88vh]">
			{/* Background layer */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				{/* Grid */}
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
						backgroundSize: "56px 56px",
					}}
				/>
				{/* Coral blob — top left */}
				<div
					className="absolute animate-hp-aurora-1 rounded-full"
					style={{
						background: "radial-gradient(circle, rgba(255,112,119,0.22) 0%, transparent 68%)",
						filter: "blur(72px)",
						height: "min(75vw, 800px)",
						left: "-12%",
						top: "-25%",
						width: "min(75vw, 800px)",
					}}
				/>
				{/* Yellow blob — right */}
				<div
					className="absolute animate-hp-aurora-2 rounded-full"
					style={{
						background: "radial-gradient(circle, rgba(255,232,124,0.14) 0%, transparent 68%)",
						filter: "blur(64px)",
						height: "min(55vw, 640px)",
						right: "-8%",
						top: "15%",
						width: "min(55vw, 640px)",
					}}
				/>
				{/* Vignette fade at bottom */}
				<div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background to-transparent" />
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-36">
				<div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
					{/* ── Left: copy ── */}
					<div className="flex flex-col gap-7">
						<Eyebrow>Discord Leveling Bot</Eyebrow>

						<h1 className={`${sc} font-extrabold text-[clamp(2.75rem,5vw,4.25rem)] leading-[1.06] tracking-tight`}>
							<span className="text-white">Level up</span>
							<br />
							<span className="text-white">your server.</span>
							<br />
							<span className="text-gradient-lurkr">Free forever.</span>
						</h1>

						<p className="max-w-110 text-[1.05rem] text-white/55 leading-relaxed">
							A fully customizable leveling system — XP curves, rank cards, role rewards, multipliers, and more. Every
							feature, completely free.
						</p>

						{/* Feature pills */}
						<div className="flex flex-wrap gap-2">
							{["No Paywalls", "Custom XP Curves", "Import from MEE6", "Role Rewards", "Rank Cards"].map((feat) => (
								<span
									className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-white/65 text-xs"
									key={feat}
								>
									{feat}
								</span>
							))}
						</div>

						{/* CTAs */}
						<div className="flex flex-wrap items-center gap-4">
							<ExternalLink
								className="flex items-center gap-2.5 rounded-xl px-6 py-3 font-bold text-[#111] text-base transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.97]"
								href={BOT_INVITE}
								style={{
									background: "linear-gradient(92.52deg, #ff7077 0%, #ffe87c 100%)",
									boxShadow: "0 0 36px rgba(255,112,119,0.38)",
								}}
							>
								<DiscordIcon className="size-5" />
								Add to Discord
							</ExternalLink>

							<Link
								className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-base text-white/75 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
								href="/guilds"
								prefetch={false}
							>
								Open Dashboard
								<ArrowRight className="size-4" />
							</Link>
						</div>
					</div>

					{/* ── Right: Discord mockup — hidden on mobile, shown sm+ ── */}
					<div
						className="hidden justify-center sm:flex lg:justify-end"
						style={{ filter: "drop-shadow(0 0 72px rgba(255,112,119,0.18))" }}
					>
						<DiscordChatMockup />
					</div>
				</div>
			</div>
		</section>
	);
}
