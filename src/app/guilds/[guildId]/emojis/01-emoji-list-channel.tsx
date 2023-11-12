"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
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
				<div className="flex items-end gap-2">
					<p className="text-lg tracking-tight text-white/75 md:text-xl">Channel</p>
					<p className="mb-1 text-xs font-light text-white/50">(Max. 1)</p>
				</div>
			</ChannelSelector>
		</>
	);
}

interface EmojiListChannelProps {
	readonly channels: Channel[];
	readonly defaultValue: Snowflake | null;
}
