import { BotMessage, ChannelHeader, ChatMessage, LevelUpCard } from "./chat-mock.tsx";
import { GradientText, SectionHeader } from "./shared.tsx";

export function FeatureChatPreview() {
	return (
		<section className="mx-auto w-full max-w-[1400px] px-8 py-24 max-md:px-5 max-md:py-16">
			<SectionHeader
				align="center"
				desc="Custom messages, embeds, conditions, placeholders. Drop level-ups only where they belong."
				kicker="Level-ups"
				title={
					<>
						Announcements that <GradientText italic>feel native.</GradientText>
					</>
				}
			/>

			<div className="mx-auto max-w-[820px] overflow-hidden rounded-2xl border border-white/5 bg-[#313338] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]">
				<ChannelHeader name="general" topic="Chat with the crew" />
				<div className="px-1 py-4">
					<ChatMessage avatarColor="#5865f2" letter="S" name="sam" roleColor="#60d1f6" time="Today at 19:58">
						just finished the tournament bracket, gg everyone
					</ChatMessage>
					<BotMessage time="Today at 19:59">
						<LevelUpCard color="#60d1f6" level={24} user="sam" />
					</BotMessage>
					<ChatMessage
						avatarColor="#ff7077"
						letter="K"
						name="koji"
						reactions={[
							{ count: 8, emoji: "🏆" },
							{ count: 3, emoji: "💯", mine: true },
						]}
						roleColor="#ff7077"
						time="Today at 20:03"
					>
						daily streak keeps growing
					</ChatMessage>
					<BotMessage time="Today at 20:04">
						<LevelUpCard color="#ff7077" level={64} user="koji" />
					</BotMessage>
					<ChatMessage avatarColor="#57f287" letter="M" name="mira" roleColor="#ffe87c" time="Today at 20:12">
						watch me overtake koji by next week 😤
					</ChatMessage>
				</div>
			</div>
		</section>
	);
}
