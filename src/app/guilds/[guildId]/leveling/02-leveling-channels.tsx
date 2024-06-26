"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { MAX_XP_CHANNELS, MAX_XP_CHANNELS_PREMIUM } from "@/lib/guild-config.ts";
import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function LevelingChannels({ channels, defaultValues, premium }: LevelingChannelProps) {
	const defaultValue = mapChannelIdsToChannels(defaultValues, channels);

	return (
		<ChannelSelector
			channels={channels}
			defaultValues={defaultValue}
			inputId="leveling-channels"
			max={getMaximumLimit("xpChannels", premium)}
			settingId="xpChannels"
		>
			<Label sub={`Max. ${MAX_XP_CHANNELS} - Max. ${MAX_XP_CHANNELS_PREMIUM} for Premium`}>Channels</Label>
		</ChannelSelector>
	);
}

interface LevelingChannelProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
