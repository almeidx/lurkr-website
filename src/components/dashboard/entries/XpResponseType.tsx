import { useState } from "react";
import type { Channel, GuildSettings, AddChangeFn } from "../../../contexts/GuildContext";
import type { Snowflake } from "../../../utils/constants";
import BasicSelect from "../../form/BasicSelect";
import Field from "../../form/Field";
import Label from "../../form/Label";
import Selector from "../../form/Selector";

interface XpResponseTypeProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

enum ResponseType {
	CHANNEL = "custom-channel",
	DM = "dm",
	NONE = "none",
	SAME_CHANNEL = "channel",
}

export function XpResponseType({ addChange, channels, settings }: XpResponseTypeProps) {
	const [xpResponseType, setXpResponseType] = useState<string>(resolveInitialXpResponseTypeValue(settings));

	return (
		<Field>
			<Label
				htmlFor="xpResponseType"
				name="Level Up Message Destination"
				url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#where-to-send-the-level-up-message"
			/>
			<div className="flex flex-row flex-wrap gap-y-2">
				<div className="w-full lg:w-1/2">
					<BasicSelect
						closeOnSelect
						initialItem={resolveInitialXpResponseType(settings)}
						items={["Same Channel", "DM", "Custom Channel", "None"]}
						onSelect={(item) => {
							const type = resolveXpResponseTypeByName(item);
							setXpResponseType(type);
							switch (type) {
								case ResponseType.DM:
								case ResponseType.SAME_CHANNEL:
									addChange("xpResponseType", type);
									break;
								case ResponseType.NONE:
									addChange("xpResponseType", null);
									break;
								default:
									addChange("xpResponseType", "123");
									break;
							}
						}}
					/>
				</div>
				<div className="w-full lg:w-1/2 lg:pl-2">
					{xpResponseType === ResponseType.CHANNEL && (
						<Selector
							id="xpResponseTypeChannel"
							initialItems={resolveInitialXpResponseChannel(settings)}
							items={channels}
							limit={1}
							onSelect={(channelIds) => addChange("xpResponseType", channelIds[0] ?? null)}
							type="Channel"
						/>
					)}
				</div>
			</div>
		</Field>
	);
}

function resolveInitialXpResponseType(settings: GuildSettings) {
	return settings.xpResponseType
		? /^\d+$/.test(settings.xpResponseType)
			? "Custom Channel"
			: settings.xpResponseType === "dm"
			? "DM"
			: "Same Channel"
		: "None";
}

function resolveXpResponseTypeByName(name: string) {
	// TODO: Refactor this
	return name === "Custom Channel"
		? ResponseType.CHANNEL
		: name === "DM"
		? ResponseType.DM
		: name === "None"
		? ResponseType.NONE
		: ResponseType.SAME_CHANNEL;
}

function resolveInitialXpResponseTypeValue(settings: GuildSettings) {
	return settings.xpResponseType
		? /^\d+$/.test(settings.xpResponseType)
			? ResponseType.CHANNEL
			: settings.xpResponseType
		: ResponseType.NONE;
}

function resolveInitialXpResponseChannel(settings: GuildSettings): Snowflake[] {
	return settings.xpResponseType ? (/^\d+$/.test(settings.xpResponseType) ? [settings.xpResponseType] : []) : [];
}
