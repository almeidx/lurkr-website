import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { AddChangeFn, Channel, GuildSettings } from "~/contexts/GuildContext";
import { getDatabaseLimit } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";

interface AutoPublishChannelsProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

export function AutoPublishChannels({ addChange, channels, settings }: AutoPublishChannelsProps) {
	const autoPublishChannelsLimit = getDatabaseLimit("autoPublishChannels", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="autoPublishChannels"
				name="Auto-Publishing Announcement Channels"
				url="https://docs.pepemanager.com/guides/automatically-published-announcements"
			/>
			<Selector
				id="autoPublishChannels"
				initialItems={(settings.autoPublishChannels as Snowflake[] | null) ?? []}
				items={channels}
				limit={autoPublishChannelsLimit}
				onSelect={(channelIds) => addChange("autoPublishChannels", channelIds)}
				type="Channel"
			/>
			<Subtitle text={`Maximum of ${autoPublishChannelsLimit} channels.`} />
		</Field>
	);
}
