import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import type { AddChangeFn, GuildSettings, Role } from "~/contexts/GuildContext";

interface TopXpRoleProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function TopXpRole({ addChange, roles, settings }: TopXpRoleProps) {
	return (
		<Field>
			<Label
				htmlFor="topXpRole"
				name="Daily Top Leveling Role"
				url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-the-top-xp-role"
			/>
			<div className="w-full max-w-md sm:min-w-[20rem]">
				<Selector
					id="topXpRole"
					initialItems={settings.topXpRole ? [settings.topXpRole] : []}
					items={roles}
					limit={1}
					onSelect={(roleIds) => addChange("topXpRole", roleIds[0] ?? null)}
					type="Role"
				/>
			</div>
		</Field>
	);
}
