import { ExternalLink } from "@/components/ExternalLink.tsx";
import { BOT_INVITE } from "@/shared-links.ts";
import { formatNumber } from "@/utils/format-number.ts";
import { sc } from "./outfit.ts";
import { DiscordIcon } from "./ui.tsx";

interface CtaSectionProps {
	readonly guildCount: number;
}

export function CtaSection({ guildCount }: CtaSectionProps) {
	return (
		<section className="relative overflow-hidden border-white/[0.07] border-t">
			{/* Background */}
			<div className="pointer-events-none absolute inset-0">
				<div
					className="absolute bottom-[-40%] left-1/2 -translate-x-1/2 rounded-full"
					style={{
						background: "radial-gradient(circle, rgba(255,112,119,0.18) 0%, transparent 65%)",
						filter: "blur(80px)",
						height: "min(90vw, 800px)",
						width: "min(90vw, 800px)",
					}}
				/>
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
						backgroundSize: "56px 56px",
					}}
				/>
				<div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background to-transparent" />
			</div>

			<div className="relative mx-auto max-w-7xl px-5 py-36 sm:px-8">
				<div className="flex flex-col items-center gap-8 text-center">
					<h2 className={`${sc} font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] text-white leading-[1.05]`}>
						Ready to level up?
					</h2>
					<p className="max-w-sm text-lg text-white/50">
						Join {formatNumber(guildCount, false)}+ Discord servers already using Lurkr — completely free.
					</p>
					<ExternalLink
						className="flex items-center gap-3 rounded-xl px-9 py-4 font-bold text-[#111] text-lg transition-all hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]"
						href={BOT_INVITE}
						style={{
							background: "linear-gradient(92.52deg, #ff7077 0%, #ffe87c 100%)",
							boxShadow: "0 0 64px rgba(255,112,119,0.45)",
						}}
					>
						<DiscordIcon className="size-6" />
						Add to Discord — Free Forever
					</ExternalLink>
				</div>
			</div>
		</section>
	);
}
