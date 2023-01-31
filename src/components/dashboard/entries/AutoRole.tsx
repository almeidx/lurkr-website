import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { Role, GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { getDatabaseLimit } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";

interface AutoRoleProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function AutoRole({ addChange, roles, settings }: AutoRoleProps) {
	const autoRoleLimit = getDatabaseLimit("autoRole", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="autoRole"
				name="On Join Roles"
				url="https://docs.pepemanager.com/guides/automatically-added-roles-with-timeout"
			/>
			<Selector
				id="autoRole"
				initialItems={(settings.autoRole as Snowflake[] | null) ?? []}
				items={roles}
				limit={autoRoleLimit}
				onSelect={(roleIds) => addChange("autoRole", roleIds)}
				type="Role"
			/>
			<Subtitle text={`Maximum of ${autoRoleLimit} roles.`} />
		</Field>
	);
}
