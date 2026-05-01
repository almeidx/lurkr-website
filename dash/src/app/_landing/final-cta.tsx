import { BOT_INVITE } from "@/shared-links.ts";
import { GradientCTA, GradientText, OutlineCTA } from "./shared.tsx";

export function FinalCTA() {
	return (
		<section className="relative overflow-hidden px-8 py-30 max-md:py-20">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,112,119,0.15)_0%,transparent_60%)]"
			/>

			<div className="relative mx-auto max-w-[800px] text-center">
				<h2 className="m-0 font-extrabold text-[clamp(2.5rem,6vw,5.5rem)] text-white leading-[1] tracking-[-0.035em]">
					Ready to <GradientText italic>level up?</GradientText>
				</h2>
				<p className="mx-auto mt-5 max-w-135 text-[18px] text-white/75 leading-[1.5]">
					Free forever. No credit card. Invite takes 30 seconds and imports your existing leaderboard in one click.
				</p>
				<div className="mt-10 flex flex-wrap justify-center gap-3.5">
					<GradientCTA external href={BOT_INVITE}>
						Add Lurkr to Discord
					</GradientCTA>
					<OutlineCTA href="/guilds">Open dashboard</OutlineCTA>
				</div>
				<p className="mt-8 text-[13px] text-white/45">
					Requires <b className="text-white/85">Manage Server</b> permission · Works with servers of any size
				</p>
			</div>
		</section>
	);
}
