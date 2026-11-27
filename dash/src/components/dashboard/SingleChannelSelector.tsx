import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import type { Channel, GuildSettings } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

/**
 * A channel picker for a setting that holds a single channel.
 */
export function SingleChannelSelector({ channels, defaultValue, inputId, settingId }: SingleChannelSelectorProps) {
	return (
		<ChannelSelector
			channels={channels}
			defaultValues={mapChannelIdsToChannels(defaultValue, channels)}
			inputId={inputId}
			max={1}
			settingId={settingId}
		>
			<Label sub="Max. 1">Channel</Label>
		</ChannelSelector>
	);
}

interface SingleChannelSelectorProps {
	readonly channels: Channel[];
	readonly defaultValue: Snowflake | null;
	/** Id for the input where the user can type */
	readonly inputId: string;
	readonly settingId: keyof Pick<GuildSettings, "emojiListChannel" | "milestonesChannel">;
}
