import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { WarningBanner } from "@/components/dashboard/WarningBanner.tsx";
import { Separator } from "@/components/Separator.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { SignInRequired } from "../sign-in-required.tsx";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { VoiceXpPerMinuteRange } from "./01-voice-xp-per-minute-range.tsx";
import { VoiceXpMinGroupCount } from "./02-voice-xp-min-group-count.tsx";
import { VoiceXpDisallowMuted } from "./03-voice-xp-disallow-muted.tsx";
import { VoiceXpMaxSession } from "./04-voice-xp-max-session.tsx";
import { VoiceXpSessionCooldown } from "./05-voice-xp-session-cooldown.tsx";
import { VoiceChannelMode } from "./06-voice-channel-mode.tsx";
import { VoiceXpChannels } from "./07-voice-xp-channels.tsx";
import { update } from "./update.ts";

export default async function VoiceLeveling({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const [{ guildId }, cookieStore] = await Promise.all([params, cookies()]);

	const token = cookieStore.get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <SignInRequired />;
	}

	const guildData = await getGuildSettings(guildId, token, "voice-leveling");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { guild, settings } = guildData;

	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form
			action={action}
			defaultValue={settings.voiceXpEnabled}
			description="Reward your members for spending time in voice channels! Voice XP is part of the leveling system, so make sure leveling is enabled on the Leveling page."
			settingId="voiceXpEnabled"
			title="Voice Leveling"
		>
			{settings.levels ? null : (
				<WarningBanner>
					The leveling system is currently disabled. Voice XP is part of the leveling system, so members will not gain
					any voice XP until you enable leveling on the Leveling page.
				</WarningBanner>
			)}

			{/* Lets the server action refuse enabling voice XP while leveling is off */}
			<input name="levels" type="hidden" value={settings.levels ? "on" : "off"} />

			<Section name="Voice Leveling Channels" tooltip="Choose in which voice channels your members can gain voice XP.">
				<VoiceChannelMode defaultValue={settings.voiceXpChannelMode} />

				<VoiceXpChannels channels={guild.channels} defaultValues={settings.voiceXpChannels} premium={guild.premium} />
			</Section>

			<Section name="Voice XP Rate">
				<VoiceXpPerMinuteRange defaultMax={settings.voiceXpPerMinuteMax} defaultMin={settings.voiceXpPerMinuteMin} />
			</Section>

			<Section name="Participation Rules">
				<VoiceXpMinGroupCount defaultValue={settings.voiceXpMinGroupCount} premium={guild.premium} />

				<Separator />

				<VoiceXpDisallowMuted defaultValue={settings.voiceXpDisallowMuted} />
			</Section>

			<Section name="Session Limits">
				<VoiceXpMaxSession defaultValue={settings.voiceXpMaxSession} premium={guild.premium} />

				<Separator />

				<VoiceXpSessionCooldown defaultValue={settings.voiceXpMaxSessionCooldown} premium={guild.premium} />
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Configure your server's voice leveling system with Lurkr!",
	title: "Voice Leveling Dashboard",
};
