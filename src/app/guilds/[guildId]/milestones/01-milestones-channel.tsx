import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function MilestonesChannel({ channels, defaultValue }: MilestonesChannelProps) {
	const defaultValues = mapChannelIdsToChannels(defaultValue, channels);

	return (
		<>
			<ChannelSelector
				channels={channels}
				defaultValues={defaultValues}
				inputId="milestones-channel"
				max={1}
				settingId="milestonesChannel"
			>
				<Label sub="Max. 1">Channel</Label>
			</ChannelSelector>
		</>
	);
}

interface MilestonesChannelProps {
	readonly channels: Channel[];
	readonly defaultValue: Snowflake | null;
}
