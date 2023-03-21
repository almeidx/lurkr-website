import { useCallback, useState, type MouseEventHandler } from "react";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import { XpChannelMode, type AddChangeFn, type Channel, type GuildSettings } from "~/contexts/GuildContext";
import { MAX_XP_CHANNELS, MAX_XP_CHANNELS_PREMIUM } from "~/utils/guild-config";

interface XpChannelsProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

export function XpChannels({ addChange, channels, settings }: XpChannelsProps) {
	const [xpChannelMode, setXpChannelMode] = useState<XpChannelMode>(settings.xpChannelMode);

	const xpChannelsLimit = settings.premium ? MAX_XP_CHANNELS_PREMIUM : MAX_XP_CHANNELS;

	const handleXpChannelModeChange: MouseEventHandler<HTMLButtonElement> = useCallback(
		(event) => {
			event.preventDefault();

			const newMode = xpChannelMode === XpChannelMode.Blacklist ? XpChannelMode.Whitelist : XpChannelMode.Blacklist;
			setXpChannelMode(newMode);

			addChange("xpChannelMode", newMode);
		},
		[addChange, xpChannelMode],
	);

	return (
		<Field>
			<Label
				htmlFor="xpChannels"
				name={`Leveling Channels (${xpChannelMode === XpChannelMode.Blacklist ? "Blacklist" : "Whitelist"})`}
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#adding-allowed-channels"
			/>
			<div className="mb-3 flex flex-row justify-start">
				<button
					className="w-fit rounded-md bg-discord-not-quite-black py-1.5 px-2 text-white shadow-sm transition-colors duration-150 focus:outline-none active:bg-discord-dark"
					onClick={handleXpChannelModeChange}
					type="button"
				>
					Use {xpChannelMode === XpChannelMode.Blacklist ? "Whitelist" : "Blacklist"}
				</button>
			</div>
			<Selector
				id="xpChannels"
				initialItems={settings.xpChannels}
				items={channels}
				limit={xpChannelsLimit}
				onSelect={(channelIds) => addChange("xpChannels", channelIds)}
				type="Channel"
			/>
			<Subtitle text={`Maximum of ${xpChannelsLimit} channels.`} />
		</Field>
	);
}
