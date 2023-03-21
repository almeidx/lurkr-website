import { useMemo } from "react";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import { ChannelType, type AddChangeFn, type Channel, type GuildSettings } from "~/contexts/GuildContext";
import type { Snowflake } from "~/utils/constants";
import { MAX_AUTO_PUBLISH_CHANNELS, MAX_AUTO_PUBLISH_CHANNELS_PREMIUM } from "~/utils/guild-config";

interface AutoPublishChannelsProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

export function AutoPublishChannels({ addChange, channels, settings }: AutoPublishChannelsProps) {
	const autoPublishChannelsLimit = settings.premium ? MAX_AUTO_PUBLISH_CHANNELS_PREMIUM : MAX_AUTO_PUBLISH_CHANNELS;

	const allowedChannels = useMemo(
		() => channels.filter((channel) => channel.type === ChannelType.GuildAnnouncement),
		[channels],
	);

	return (
		<Field>
			<Label
				htmlFor="autoPublishChannels"
				name="Auto-Publishing Announcement Channels"
				url="https://docs.lurkr.gg/guides/automatically-published-announcements"
			/>
			<Selector
				id="autoPublishChannels"
				initialItems={(settings.autoPublishChannels as Snowflake[] | null) ?? []}
				items={allowedChannels}
				limit={autoPublishChannelsLimit}
				onSelect={(channelIds) => addChange("autoPublishChannels", channelIds)}
				type="Channel"
			/>
			<Subtitle text={`Maximum of ${autoPublishChannelsLimit} channels.`} />
		</Field>
	);
}
