"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { MAX_XP_CHANNELS, MAX_XP_CHANNELS_PREMIUM } from "@/lib/guild-config.ts";
import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { useMemo } from "react";

export function LevelingChannels({ channels, defaultValues, premium }: LevelingChannelProps) {
	const defaultValue = useMemo(
		() => defaultValues.map((id) => channels.find((channel) => channel.id === id)!).filter(Boolean),
		[channels, defaultValues],
	);

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
