"use client";

import { useMemo, useState } from "react";
import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { ChatBubble } from "@/components/icons/mdi/chat-bubble.tsx";
import { Chat } from "@/components/icons/mdi/chat.tsx";
import { DoNotDisturbAlt } from "@/components/icons/mdi/do-not-disturb.tsx";
import { Topic } from "@/components/icons/mdi/topic.tsx";
import { type Channel, XpAnnouncementChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function LevelUpMessageChannel({ channels, defaultValue, defaultCustomChannel }: LevelUpMessageProps) {
	return (
		// `key` is required here to prevent rollback to previous setting after saving
		<LevelUpMessageChannelInner
			channels={channels}
			defaultCustomChannel={defaultCustomChannel}
			defaultValue={defaultValue}
			key={defaultValue}
		/>
	);
}

function LevelUpMessageChannelInner({ channels, defaultCustomChannel, defaultValue }: LevelUpMessageProps) {
	const [value, setValue] = useState(defaultValue);

	const customChannel = useMemo(() => {
		if (value === XpAnnouncementChannelType.Custom && defaultCustomChannel) {
			const channel = mapChannelIdsToChannels(defaultCustomChannel, channels);
			if (channel.length) return channel;
		}

		return [];
	}, [channels, defaultCustomChannel, value]);

	return (
		<div className="flex w-fit flex-col gap-2">
			<RadioGroup
				aria-label="Level up message channel"
				className="gap-4"
				name="xpAnnounceChannelType"
				onChange={(newValue) => setValue(newValue as XpAnnouncementChannelType)}
				value={value}
			>
				<Radio controlPosition="end" value={XpAnnouncementChannelType.Direct}>
					<span className="flex items-center">
						<Chat className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
						Direct messages
					</span>
				</Radio>

				<Radio controlPosition="end" value={XpAnnouncementChannelType.SameChannel}>
					<span className="flex items-center">
						<Topic className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
						The same channel
					</span>
				</Radio>

				<Radio controlPosition="end" value={XpAnnouncementChannelType.None}>
					<span className="flex items-center">
						<DoNotDisturbAlt className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
						None
					</span>
				</Radio>

				<Radio controlPosition="end" value={XpAnnouncementChannelType.Custom}>
					<span className="flex items-center">
						<ChatBubble className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
						Custom Channel
					</span>
				</Radio>
			</RadioGroup>

			{/* Kept out of the radio group, which would otherwise handle the arrow keys pressed in the selector. */}
			<ChannelSelector
				channels={channels}
				defaultValues={customChannel}
				disabled={value !== XpAnnouncementChannelType.Custom}
				inputId="custom-leveling-channel"
				key={value}
				max={1}
				required={value === XpAnnouncementChannelType.Custom}
				settingId="xpAnnounceChannel"
			/>
		</div>
	);
}

interface LevelUpMessageProps {
	readonly channels: Channel[];
	readonly defaultCustomChannel: Snowflake | null;
	readonly defaultValue: XpAnnouncementChannelType;
}
