import { useCallback, useState, type MouseEventHandler } from "react";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { Channel, GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { getDatabaseLimit } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";

interface XpChannelsProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

export function XpChannels({ addChange, channels, settings }: XpChannelsProps) {
	const [xpChannels, setXpChannels] = useState<Snowflake[]>(
		(settings.xpWhitelistedChannels as Snowflake[] | null) ??
			(settings.xpBlacklistedChannels as Snowflake[] | null) ??
			[],
	);
	const [xpChannelsType, setXpChannelsType] = useState<"blacklist" | "whitelist">(
		settings.xpBlacklistedChannels ? "blacklist" : "whitelist",
	);

	const xpChannelsLimit = getDatabaseLimit("xpChannels", settings.premium).maxLength;

	const handleXpChannelsTypeChange: MouseEventHandler<HTMLButtonElement> = useCallback(
		(event) => {
			event.preventDefault();

			const currentType = `${xpChannelsType}` as const;
			setXpChannelsType(currentType === "blacklist" ? "whitelist" : "blacklist");

			if (currentType === "blacklist") {
				addChange("xpBlacklistedChannels", []);
				addChange("xpWhitelistedChannels", xpChannels);
				return;
			}

			addChange("xpWhitelistedChannels", []);
			addChange("xpBlacklistedChannels", xpChannels);
		},
		[addChange, xpChannels, xpChannelsType],
	);

	return (
		<Field>
			<Label
				htmlFor="xpChannels"
				name={`Leveling Channels (${xpChannelsType === "blacklist" ? "Blacklist" : "Whitelist"})`}
				url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-allowed-channels"
			/>
			<div className="mb-3 flex flex-row justify-start">
				<button
					className="w-fit rounded-md bg-discord-not-quite-black py-1.5 px-2 text-white shadow-sm transition-colors duration-150 focus:outline-none active:bg-discord-dark"
					onClick={handleXpChannelsTypeChange}
					type="button"
				>
					Use {xpChannelsType === "blacklist" ? "Whitelist" : "Blacklist"}
				</button>
			</div>
			<Selector
				id="xpChannels"
				initialItems={
					settings.xpBlacklistedChannels?.length
						? settings.xpBlacklistedChannels
						: settings.xpWhitelistedChannels?.length
						? settings.xpWhitelistedChannels
						: []
				}
				items={channels}
				limit={xpChannelsLimit}
				onSelect={(channelIds) => {
					setXpChannels(channelIds);
					addChange(xpChannelsType === "whitelist" ? "xpWhitelistedChannels" : "xpBlacklistedChannels", channelIds);
				}}
				type="Channel"
			/>
			<Subtitle text={`Maximum of ${xpChannelsLimit} channels.`} />
		</Field>
	);
}
