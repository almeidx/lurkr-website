"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function EmojiListChannel({ channels, defaultValue }: EmojiListChannelProps) {
	const defaultValues = mapChannelIdsToChannels(defaultValue, channels);

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
