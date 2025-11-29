"use client";

import { useStoreState } from "@ariakit/react";
import { useMemo } from "react";
import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";
import { Chat } from "@/components/icons/mdi/chat.tsx";
import { ChatBubble } from "@/components/icons/mdi/chat-bubble.tsx";
import { DoNotDisturbAlt } from "@/components/icons/mdi/do-not-disturb.tsx";
import { Topic } from "@/components/icons/mdi/topic.tsx";
import { type Channel, XpAnnouncementType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function LevelUpMessageChannel({ channels, defaultValue, defaultCustomChannel }: LevelUpMessageProps) {
	const radio = useRadioStore({ defaultValue });
	const value = useStoreState(radio, "value");

	const customChannel = useMemo(() => {
		if (value === XpAnnouncementType.Custom && defaultCustomChannel) {
			const channel = mapChannelIdsToChannels(defaultCustomChannel, channels);
			if (channel.length) return channel;
		}

		return [];
	}, [channels, defaultCustomChannel, value]);

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeDirect">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<Chat className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					Direct messages
				</div>
				<Radio id="xpAnnounceChannelTypeDirect" name="xpAnnounceChannelType" value={XpAnnouncementType.Direct} />
			</label>

			<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeSameChannel">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<Topic className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					The same channel
				</div>
				<Radio
					id="xpAnnounceChannelTypeSameChannel"
					name="xpAnnounceChannelType"
					value={XpAnnouncementType.SameChannel}
				/>
			</label>

			<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeNone">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<DoNotDisturbAlt className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					None
				</div>
				<Radio id="xpAnnounceChannelTypeNone" name="xpAnnounceChannelType" value={XpAnnouncementType.None} />
			</label>

			{/* TODO: Clear channel selector if user selects a different radio option */}
			<ChannelSelector
				channels={channels}
				defaultValues={customChannel}
				disabled={value !== XpAnnouncementType.Custom}
				inputId="custom-leveling-channel"
				max={1}
				required={value === XpAnnouncementType.Custom}
				settingId="xpAnnounceChannel"
			>
				<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeCustom">
					<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
						<ChatBubble className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
						Custom Channel
					</div>
					<Radio id="xpAnnounceChannelTypeCustom" name="xpAnnounceChannelType" value={XpAnnouncementType.Custom} />
				</label>
			</ChannelSelector>
		</RadioGroup>
	);
}

interface LevelUpMessageProps {
	readonly channels: Channel[];
	readonly defaultCustomChannel: Snowflake | null;
	readonly defaultValue: XpAnnouncementType;
}
