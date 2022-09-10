import { useContext, useEffect } from "react";
import { GuildContext, type Channel, type GuildSettings } from "../../../contexts/GuildContext";
import { getDatabaseLimit } from "../../../utils/common";
import type { Snowflake } from "../../../utils/constants";
import Field from "../../form/Field";
import Fieldset from "../../form/Fieldset";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Subtitle from "../../form/Subtitle";
import Toggle from "../../form/Toggle";
import Header from "../Header";

interface MiscellaneousProps {
	channels: Channel[];
	openMenu(): void;
	settings: GuildSettings;
}

export default function Miscellaneous({ channels, settings, openMenu }: MiscellaneousProps) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { addChange } = useContext(GuildContext);

	const autoPublishChannelsLimit = getDatabaseLimit("autoPublishChannels", settings.premium).maxLength;

	useEffect(() => {
		window.scroll({
			behavior: "auto",
			left: 0,
			top: 0,
		});
	}, [openMenu]);

	return (
		<>
			<Header
				openMenu={openMenu}
				description="Miscellaneous options that don't fit into any other category."
				title="Miscellaneous"
			/>

			<Fieldset>
				<Field direction="row">
					<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
						<Label
							htmlFor="storeCounts"
							name="Store Member Counts"
							url="https://docs.pepemanager.com/config-commands/config/toggle"
							withMargin={false}
						/>
						<Toggle
							size="small"
							id="storeCounts"
							initialValue={settings.storeCounts}
							onChange={(state) => addChange("storeCounts", state)}
						/>
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="autoPublishChannels"
						name="Auto Publish Channels"
						url="https://docs.pepemanager.com/guides/automatically-published-announcements"
					/>
					<Selector
						id="autoPublishChannels"
						limit={autoPublishChannelsLimit}
						initialItems={(settings.autoPublishChannels as Snowflake[] | null) ?? []}
						items={channels}
						onSelect={(channelIds) => addChange("autoPublishChannels", channelIds)}
						type="channel"
					/>
					<Subtitle text={`Maximum of ${autoPublishChannelsLimit} channels.`} />
				</Field>
			</Fieldset>
		</>
	);
}
