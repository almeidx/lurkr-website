"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
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
			<div className="flex items-end gap-2">
				<p className="text-lg tracking-tight text-white/75 md:text-xl">Channels</p>
				<p className="mb-1 text-xs font-light text-white/50">(Max. 30 - Max. 50 for Premium)</p>
			</div>
		</ChannelSelector>
	);
}

interface LevelingChannelProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
