import { useContext, useEffect } from "react";
import Header from "@/dashboard/Header";
import { AutoRole } from "@/entries/AutoRole";
import { AutoRoleTimeout } from "@/entries/AutoRoleTimeout";
import Fieldset from "@/form/Fieldset";
import { GuildContext, type GuildSettings, type Role } from "~/contexts/GuildContext";

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

interface AutoroleProps {
	openMenu(): void;
	readonly roles: Role[];
	readonly settings: GuildSettings;
}
