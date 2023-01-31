import { useContext, useEffect } from "react";
import Header from "@/dashboard/Header";
import { MentionCooldown } from "@/entries/MentionCooldown";
import { MentionCooldownRoles } from "@/entries/MentionCooldownRoles";
import Fieldset from "@/form/Fieldset";
import { GuildContext, type GuildSettings, type Role } from "~/contexts/GuildContext";

export default function MentionCooldownPage({ settings, roles, openMenu }: MentionCooldownProps) {
	const { addChange } = useContext(GuildContext);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Automatically make roles non-mentionable after being mentioned for a certain amount of time."
				openMenu={openMenu}
				title="Mention Cooldown"
			/>

			<Fieldset>
				<MentionCooldown addChange={addChange} settings={settings} />

				<MentionCooldownRoles addChange={addChange} roles={roles} settings={settings} />
			</Fieldset>
		</>
	);
}

interface MentionCooldownProps {
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}
