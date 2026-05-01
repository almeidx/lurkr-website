import { BOT_INVITE } from "@/shared-links.ts";
import { formatNumber } from "@/utils/format-number.ts";
import { BotMessage, ChatMessage, LevelUpCard } from "./chat-mock.tsx";
import { GradientCTA, GradientText, OutlineCTA } from "./shared.tsx";

export function Hero({ guildCount }: { readonly guildCount: number }) {
	return (
		<section className="relative mx-auto w-full max-w-[1400px] px-8 pt-16 pb-10 max-lg:px-5">
			<div className="grid grid-cols-2 items-center gap-14 max-lg:grid-cols-1 max-lg:gap-10">
				<div>
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1.5 font-semibold text-[12px] text-primary">
						<span aria-hidden className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_#ff7077]" />
						{formatNumber(guildCount, false)}+ servers leveling up right now
					</div>

					<h1 className="m-0 font-extrabold text-[clamp(2.75rem,5.5vw,5.25rem)] text-white leading-[0.98] tracking-[-0.035em]">
						Level up
						<br />
						your server.
						<br />
						<GradientText italic>Finally,</GradientText> for free.
					</h1>

					<p className="mt-6 max-w-115 text-[17px] text-white/75 leading-[1.55]">
						The ultimate Discord leveling bot. Track activity, reward engagement, and build thriving communities —
						without hitting a paywall on day one.
					</p>

					<div className="mt-9 flex flex-wrap gap-3.5">
						<GradientCTA external href={BOT_INVITE}>
							Invite to Discord
						</GradientCTA>
						<OutlineCTA href="/levels">See live leaderboard</OutlineCTA>
					</div>

					<p className="mt-7 flex items-center gap-3 text-[12px] text-white/45">
						<span className="inline-flex size-1.5 rounded-full bg-green" />
						Free forever · No paywall on core features
					</p>
				</div>

				<HeroChatPreview />
			</div>
		</section>
	);
}

function HeroChatPreview() {
	return (
		<div className="overflow-hidden rounded-2xl border border-white/5 bg-[#313338] px-1 py-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,112,119,0.1)] [transform:perspective(1200px)_rotateY(-3deg)] max-md:rotate-0 max-md:transform-none">
			<div className="mb-2 flex items-center gap-2 border-white/5 border-b px-4 pb-3">
				<span className="font-semibold text-[17px] text-white/40">#</span>
				<span className="font-semibold text-[15px] text-white">general</span>
			</div>

			<ChatMessage
				avatarColor="#5865f2"
				letter="A"
				name="alex"
				reactions={[
					{ count: 12, emoji: "🎉", mine: true },
					{ count: 4, emoji: "🔥" },
				]}
				roleColor="#57f287"
				time="Today at 20:41"
			>
				finally hit level 12 lmao
			</ChatMessage>

			<BotMessage>
				<LevelUpCard color="#57f287" level={12} user="alex" />
			</BotMessage>

			<ChatMessage avatarColor="#ffe87c" letter="M" name="mira" roleColor="#ffe87c" time="Today at 20:43">
				gz!! 🎊
			</ChatMessage>
		</div>
	);
}
