import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { MAX_AUTO_PUBLISH_CHANNELS, MAX_AUTO_PUBLISH_CHANNELS_PREMIUM } from "@/lib/guild-config.ts";
import { type Channel, ChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";

export function AutomaticallyPublishChannels({ channels, defaultValues, premium }: AutomaticallyPublishChannelsProps) {
	const announcementChannels = channels.filter(
		(channel) => channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildCategory,
	);

	const defaultValue = defaultValues
		.map((channelId) => announcementChannels.find((channel) => channel.id === channelId)!)
		.filter((channel) => channel !== undefined);

	return (
		<ChannelSelector
			channels={announcementChannels}
			defaultValues={defaultValue}
			inputId="automatically-publish-announcement-channels"
			max={getMaximumLimit("autoPublishChannels", premium)}
			menuPlacement="top"
			settingId="autoPublishChannels"
		>
			<Label sub={`Max. ${MAX_AUTO_PUBLISH_CHANNELS} - Max. ${MAX_AUTO_PUBLISH_CHANNELS_PREMIUM} for Premium`}>
				Channel
			</Label>
		</ChannelSelector>
	);
}

interface AutomaticallyPublishChannelsProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
