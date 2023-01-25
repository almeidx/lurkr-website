import type { AddChangeFn, GuildSettings } from "../../../contexts/GuildContext";
import Field from "../../form/Field";
import Label from "../../form/Label";
import Toggle from "../../form/Toggle";

interface XpAnnounceOnlyXpRolesProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpAnnounceOnlyXpRoles({ addChange, settings }: XpAnnounceOnlyXpRolesProps) {
	return (
		<Field direction="row">
			<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
				<Label
					htmlFor="xpAnnounceOnlyXpRoles"
					name="Only Announce Level-Ups Together With Role Rewards"
					url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#when-to-send-the-level-up-message"
					withMargin={false}
				/>
				<Toggle
					id="xpAnnounceOnlyXpRoles"
					initialValue={settings.xpAnnounceOnlyXpRoles}
					onChange={(state) => addChange("xpAnnounceOnlyXpRoles", state)}
					size="small"
				/>
			</div>
		</Field>
	);
}
