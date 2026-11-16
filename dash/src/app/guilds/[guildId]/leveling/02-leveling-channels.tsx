import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function LevelingChannels({ channels, defaultValues, premium }: LevelingChannelProps) {
	const defaultValue = mapChannelIdsToChannels(defaultValues, channels);

	return (
		<ChannelSelector
			channels={channels}
			defaultValues={defaultValue}
			inputId="leveling-channels"
			max={limitFor("xpChannels", premium)}
			settingId="xpChannels"
		>
			<Label sub={limitLabel("xpChannels")}>Channels</Label>
		</ChannelSelector>
	);
}

interface LevelingChannelProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
