import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { type Channel, ChannelType } from "@/lib/guild.ts";
import { MAX_XP_CHANNELS, MAX_XP_CHANNELS_PREMIUM } from "@/lib/guild-config.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function VoiceXpChannels({ channels, defaultValues, premium }: VoiceXpChannelsProps) {
	const voiceChannels = channels.filter(
		(channel) => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice,
	);

	const defaultValue = mapChannelIdsToChannels(defaultValues, voiceChannels);

	return (
		<ChannelSelector
			channels={voiceChannels}
			defaultValues={defaultValue}
			inputId="voice-xp-channels"
			max={premium ? MAX_XP_CHANNELS_PREMIUM : MAX_XP_CHANNELS}
			settingId="voiceXpChannels"
		>
			<Label sub={`Max. ${MAX_XP_CHANNELS} - Max. ${MAX_XP_CHANNELS_PREMIUM} for Premium`}>Voice Channels</Label>
		</ChannelSelector>
	);
}

interface VoiceXpChannelsProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
