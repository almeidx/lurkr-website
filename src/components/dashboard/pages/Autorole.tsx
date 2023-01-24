import { useContext, useEffect } from "react";
import { GuildContext, type GuildSettings, type Role } from "../../../contexts/GuildContext";
import Fieldset from "../../form/Fieldset";
import Header from "../Header";
import { AutoRole } from "../entries/AutoRole";
import { AutoRoleTimeout } from "../entries/AutoRoleTimeout";

interface AutoroleProps {
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}

export default function Autorole({ settings, roles, openMenu }: AutoroleProps) {
	const { addChange } = useContext(GuildContext);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Autoroles consist of roles that are given to users when they join the server."
				openMenu={openMenu}
				title="Autorole"
			/>

			<Fieldset>
				<AutoRole addChange={addChange} roles={roles} settings={settings} />

				<AutoRoleTimeout addChange={addChange} settings={settings} />
			</Fieldset>
		</>
	);
}
