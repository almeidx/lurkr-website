import { useContext, useEffect } from "react";
import Header from "@/dashboard/Header";
import { AutoPublishChannels } from "@/entries/AutoPublishChannels";
import { StoreCounts } from "@/entries/StoreCounts";
import Fieldset from "@/form/Fieldset";
import { type Channel, GuildContext, type GuildSettings } from "~/contexts/GuildContext";

export default function Miscellaneous({ channels, settings, openMenu }: MiscellaneousProps) {
	const { addChange } = useContext(GuildContext);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Miscellaneous options that don't fit into any other category."
				openMenu={openMenu}
				title="Miscellaneous"
			/>

			<Fieldset>
				<StoreCounts addChange={addChange} settings={settings} />

				<AutoPublishChannels addChange={addChange} channels={channels} settings={settings} />
			</Fieldset>
		</>
	);
}

interface MiscellaneousProps {
	channels: Channel[];
	openMenu(): void;
	settings: GuildSettings;
}
