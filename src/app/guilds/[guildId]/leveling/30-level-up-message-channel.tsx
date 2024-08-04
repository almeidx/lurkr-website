"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";
import { ChatBubble } from "@/components/icons/mdi/chat-bubble.tsx";
import { Chat } from "@/components/icons/mdi/chat.tsx";
import { DoNotDisturbAlt } from "@/components/icons/mdi/do-not-disturb.tsx";
import { Topic } from "@/components/icons/mdi/topic.tsx";
import { type Channel, XpAnnouncementChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";
import { useMemo } from "react";

export function LevelUpMessageChannel({ channels, defaultValue, defaultCustomChannel }: LevelUpMessageProps) {
	const radio = useRadioStore({ defaultValue });
	const value = radio.useState("value");

	const customChannel = useMemo(() => {
		if (value === XpAnnouncementChannelType.Custom && defaultCustomChannel) {
			const channel = mapChannelIdsToChannels(defaultCustomChannel, channels);
			if (channel.length) return channel;
		}

		return [];
	}, [channels, defaultCustomChannel, value]);

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<Chat className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					Direct messages
				</div>
				<Radio value={XpAnnouncementChannelType.Direct} id="xpAnnounceChannelType" name="xpAnnounceChannelType" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<Topic className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					The same channel
				</div>
				<Radio value={XpAnnouncementChannelType.SameChannel} id="xpAnnounceChannelType" name="xpAnnounceChannelType" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<DoNotDisturbAlt className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					None
				</div>
				<Radio value={XpAnnouncementChannelType.None} id="xpAnnounceChannelType" name="xpAnnounceChannelType" />
			</label>

			{/* TODO: Clear channel selector if user selects a different radio option */}
			<ChannelSelector
				channels={channels}
				defaultValues={customChannel}
				disabled={value !== XpAnnouncementChannelType.Custom}
				inputId="custom-leveling-channel"
				max={1}
				required={value === XpAnnouncementChannelType.Custom}
				settingId="xpAnnounceChannel"
			>
				<label className="flex items-center justify-between">
					<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
						<ChatBubble className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
						Custom Channel
					</div>
					<Radio value={XpAnnouncementChannelType.Custom} id="xpAnnounceChannelType" name="xpAnnounceChannelType" />
				</label>
			</ChannelSelector>
		</RadioGroup>
	);
}

interface LevelUpMessageProps {
	readonly channels: Channel[];
	readonly defaultCustomChannel: Snowflake | null;
	readonly defaultValue: XpAnnouncementChannelType;
}
