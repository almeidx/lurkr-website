"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { useMemo } from "react";

export function EmojiListChannel({ channels, defaultValue }: EmojiListChannelProps) {
	const defaultValues = useMemo(() => {
		if (defaultValue) {
			const channel = channels.find((channel) => channel.id === defaultValue);
			if (channel) {
				return [channel];
			}
		}

		return [];
	}, [channels, defaultValue]);

	return (
		<>
			<ChannelSelector
				channels={channels}
				defaultValues={defaultValues}
				inputId="emoji-list-channel"
				max={1}
				settingId="emojiListChannel"
			>
				<Label sub="Max. 1">Channel</Label>
			</ChannelSelector>
		</>
	);
}

interface EmojiListChannelProps {
	readonly channels: Channel[];
	readonly defaultValue: Snowflake | null;
}
