import { useMemo, useState } from "react";
import BasicSelect from "@/form/BasicSelect";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import {
	ChannelType,
	XpAnnouncementChannelType,
	type AddChangeFn,
	type Channel,
	type GuildSettings,
} from "~/contexts/GuildContext";

interface XpResponseTypeProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

const announceChannelTypes = [
	"Same Channel",
	"Direct Message",
	"Custom Channel",
	"None",
] as const satisfies readonly ReturnType<typeof mapTypeToName>[];

export function XpAnnounceChannel({ addChange, channels, settings }: XpResponseTypeProps) {
	const [xpAnnounceChannelType, setXpAnnounceChannelType] = useState(settings.xpAnnounceChannelType);

	const allowedChannels = useMemo(
		() => channels.filter((channel) => channel.type !== ChannelType.GuildForum),
		[channels],
	);

	return (
		<Field>
			<Label
				htmlFor="xpResponseType"
				name="Level Up Message Destination"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#where-to-send-the-level-up-message"
			/>
			<div className="flex flex-row flex-wrap gap-y-2">
				<div className="w-full lg:w-1/2">
					<BasicSelect
						closeOnSelect
						initialItem={mapTypeToName(settings)}
						items={announceChannelTypes}
						onSelect={(item) => {
							const type = mapNameToType(item as (typeof announceChannelTypes)[number]);

							setXpAnnounceChannelType(type);
							addChange("xpAnnounceChannelType", type);

							if (type !== XpAnnouncementChannelType.Custom) {
								addChange("xpAnnounceChannel", null);
							}
						}}
					/>
				</div>
				<div className="w-full lg:w-1/2 lg:pl-2">
					{xpAnnounceChannelType === XpAnnouncementChannelType.Custom ? (
						<Selector
							id="xpAnnounceChannel"
							initialItems={settings.xpAnnounceChannel ? [settings.xpAnnounceChannel] : []}
							items={allowedChannels}
							limit={1}
							onSelect={(channelIds) => addChange("xpAnnounceChannel", channelIds[0] ?? null)}
							type="Channel"
						/>
					) : null}
				</div>
			</div>
		</Field>
	);
}

function mapTypeToName(settings: GuildSettings) {
	switch (settings.xpAnnounceChannelType) {
		case XpAnnouncementChannelType.Custom:
			return "Custom Channel";
		case XpAnnouncementChannelType.Direct:
			return "Direct Message";
		case XpAnnouncementChannelType.None:
			return "None";
		case XpAnnouncementChannelType.SameChannel:
			return "Same Channel";
	}
}

function mapNameToType(name: ReturnType<typeof mapTypeToName>) {
	switch (name) {
		case "Custom Channel":
			return XpAnnouncementChannelType.Custom;
		case "Direct Message":
			return XpAnnouncementChannelType.Direct;
		case "None":
			return XpAnnouncementChannelType.None;
		case "Same Channel":
			return XpAnnouncementChannelType.SameChannel;
	}
}
