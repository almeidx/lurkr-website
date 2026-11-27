import { LimitedChannelSelector } from "@/components/dashboard/LimitedChannelSelector.tsx";
import { type Channel, ChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function AutomaticallyPublishChannels({ channels, defaultValues, premium }: AutomaticallyPublishChannelsProps) {
	const announcementChannels = channels.filter(
		(channel) => channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildCategory,
	);

	return (
		<LimitedChannelSelector
			channels={announcementChannels}
			defaultValues={defaultValues}
			inputId="automatically-publish-announcement-channels"
			label="Channel"
			limit="autoPublishChannels"
			menuPlacement="top"
			premium={premium}
		/>
	);
}

interface AutomaticallyPublishChannelsProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
