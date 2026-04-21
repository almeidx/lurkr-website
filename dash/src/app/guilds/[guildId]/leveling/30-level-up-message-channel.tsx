"use client";

import { RadioProvider, useRadioContext, useStoreState } from "@ariakit/react";
import { useMemo } from "react";
import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { Chat } from "@/components/icons/mdi/chat.tsx";
import { ChatBubble } from "@/components/icons/mdi/chat-bubble.tsx";
import { DoNotDisturbAlt } from "@/components/icons/mdi/do-not-disturb.tsx";
import { Topic } from "@/components/icons/mdi/topic.tsx";
import { type Channel, XpAnnouncementChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function LevelUpMessageChannel({ channels, defaultValue, defaultCustomChannel }: LevelUpMessageProps) {
	return (
		// `key` is required here to prevent rollback to previous setting after saving
		<RadioProvider defaultValue={defaultValue} key={defaultValue}>
			<LevelUpMessageChannelInner channels={channels} defaultCustomChannel={defaultCustomChannel} />
		</RadioProvider>
	);
}

function LevelUpMessageChannelInner({ channels, defaultCustomChannel }: LevelUpMessageInnerProps) {
	const store = useRadioContext();
	const value = useStoreState(store, "value");

	const customChannel = useMemo(() => {
		if (value === XpAnnouncementChannelType.Custom && defaultCustomChannel) {
			const channel = mapChannelIdsToChannels(defaultCustomChannel, channels);
			if (channel.length) return channel;
		}

		return [];
	}, [channels, defaultCustomChannel, value]);

	return (
		<RadioGroup className="flex w-fit flex-col gap-4">
			<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeDirect">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<Chat className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					Direct messages
				</div>
				<Radio id="xpAnnounceChannelTypeDirect" name="xpAnnounceChannelType" value={XpAnnouncementChannelType.Direct} />
			</label>

			<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeSameChannel">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<Topic className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					The same channel
				</div>
				<Radio
					id="xpAnnounceChannelTypeSameChannel"
					name="xpAnnounceChannelType"
					value={XpAnnouncementChannelType.SameChannel}
				/>
			</label>

			<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeNone">
				<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
					<DoNotDisturbAlt className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
					None
				</div>
				<Radio id="xpAnnounceChannelTypeNone" name="xpAnnounceChannelType" value={XpAnnouncementChannelType.None} />
			</label>

			<div className="flex flex-col gap-2">
				<label className="flex items-center justify-between" htmlFor="xpAnnounceChannelTypeCustom">
					<div className="flex items-center text-lg text-white/75 tracking-tight md:text-xl">
						<ChatBubble className="mr-2 text-[#fff]" fill="url(#icon-gradient-tertiary)" />
						Custom Channel
					</div>
					<Radio
						id="xpAnnounceChannelTypeCustom"
						name="xpAnnounceChannelType"
						value={XpAnnouncementChannelType.Custom}
					/>
				</label>

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
		</RadioGroup>
	);
}

interface LevelUpMessageProps {
	readonly channels: Channel[];
	readonly defaultCustomChannel: Snowflake | null;
	readonly defaultValue: XpAnnouncementChannelType;
}

interface LevelUpMessageInnerProps {
	readonly channels: Channel[];
	readonly defaultCustomChannel: Snowflake | null;
}
