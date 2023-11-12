import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { type Channel, ChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { useMemo } from "react";

export function AutomaticallyPublishChannels({ channels, defaultValues, premium }: AutomaticallyPublishChannelsProps) {
	const announcementChannels = useMemo(
		() => channels.filter((channel) => channel.type === ChannelType.GuildAnnouncement),
		[channels],
	);

	const defaultValue = useMemo(
		() =>
			defaultValues
				.map((channelId) => announcementChannels.find((channel) => channel.id === channelId)!)
				.filter(Boolean),
		[announcementChannels, defaultValues],
	);

	return (
		<ChannelSelector
			channels={announcementChannels}
			defaultValues={defaultValue}
			inputId="automatically-publish-announcement-channels"
			max={getMaximumLimit("autoPublishChannels", premium)}
			settingId="autoPublishChannels"
		>
			<div className="flex items-end gap-2">
				<p className="text-lg tracking-tight text-white/75 md:text-xl">Channel</p>
				<p className="mb-1 text-xs font-light text-white/50">(Max. 5 - Max. 25 for Premium)</p>
			</div>
		</ChannelSelector>
	);
}

interface AutomaticallyPublishChannelsProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
