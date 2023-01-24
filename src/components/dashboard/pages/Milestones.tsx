import { useContext, useEffect } from "react";
import { GuildContext, type Channel, type GuildSettings, type Role } from "../../../contexts/GuildContext";
import Fieldset from "../../form/Fieldset";
import Header from "../Header";
import { MilestonesChannel } from "../entries/MilestonesChannel";
import { MilestonesInterval } from "../entries/MilestonesInterval";
import { MilestonesMessage } from "../entries/MilestonesMessage";
import { MilestonesRoles } from "../entries/MilestonesRoles";

interface MilestonesProps {
	channels: Channel[];
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}

export default function Milestones({ channels, settings, roles, openMenu }: MilestonesProps) {
	const { addChange } = useContext(GuildContext);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Automatically announce member milestones in your server."
				id="milestones"
				initialValue={settings.storeMilestones}
				onChange={(state) => addChange("storeMilestones", state)}
				openMenu={openMenu}
				title="Milestones"
			/>

			<Fieldset>
				<MilestonesChannel addChange={addChange} channels={channels} settings={settings} />

				<MilestonesInterval addChange={addChange} settings={settings} />

				<MilestonesMessage addChange={addChange} settings={settings} />

				<MilestonesRoles addChange={addChange} roles={roles} settings={settings} />
			</Fieldset>
		</>
	);
}
