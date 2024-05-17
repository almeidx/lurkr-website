"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";
import { type Channel, XpAnnouncementChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { Chat, ChatBubble, DoNotDisturb, Topic } from "@mui/icons-material";
import { useMemo } from "react";

export function LevelUpMessageChannel({ channels, defaultValue, defaultCustomChannel }: LevelUpMessageProps) {
	const radio = useRadioStore({ defaultValue });
	const value = radio.useState("value");

	const customChannel = useMemo(() => {
		if (value === XpAnnouncementChannelType.Custom && defaultCustomChannel) {
			const channel = channels.find((channel) => channel.id === defaultCustomChannel);
			if (channel) return [channel];
		}

		return [];
	}, [channels, defaultCustomChannel, value]);

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<Chat className="mr-2 fill-icon-gradient-tertiary text-[#fff]" />
					Direct messages
				</div>
				<Radio value={XpAnnouncementChannelType.Direct} id="xpAnnounceChannelType" name="xpAnnounceChannelType" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<Topic className="mr-2 fill-icon-gradient-tertiary text-[#fff]" />
					The same channel
				</div>
				<Radio value={XpAnnouncementChannelType.SameChannel} id="xpAnnounceChannelType" name="xpAnnounceChannelType" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<DoNotDisturb className="mr-2 fill-icon-gradient-tertiary text-[#fff]" />
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
				settingId="xpAnnounceChannel"
			>
				<label className="flex items-center justify-between">
					<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
						<ChatBubble className="mr-2 fill-icon-gradient-tertiary text-[#fff]" />
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
