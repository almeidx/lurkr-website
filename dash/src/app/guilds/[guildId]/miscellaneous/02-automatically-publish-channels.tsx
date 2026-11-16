import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import { type Channel, ChannelType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function AutomaticallyPublishChannels({ channels, defaultValues, premium }: AutomaticallyPublishChannelsProps) {
	const announcementChannels = channels.filter(
		(channel) => channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildCategory,
	);

	const defaultValue = defaultValues.flatMap((channelId) => {
		const channel = announcementChannels.find((c) => c.id === channelId);
		return channel ? [channel] : [];
	});

	return (
		<ChannelSelector
			channels={announcementChannels}
			defaultValues={defaultValue}
			inputId="automatically-publish-announcement-channels"
			max={limitFor("autoPublishChannels", premium)}
			menuPlacement="top"
			settingId="autoPublishChannels"
		>
			<Label sub={limitLabel("autoPublishChannels")}>Channel</Label>
		</ChannelSelector>
	);
}

interface AutomaticallyPublishChannelsProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
}
