import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn, Role } from "~/contexts/GuildContext";
import { getDatabaseLimit } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";

interface NoXpRoleProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function NoXpRoles({ addChange, roles, settings }: NoXpRoleProps) {
	const noXpRolesLimit = getDatabaseLimit("noXpRoles", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="noXpRoles"
				name="No Leveling Roles"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#adding-no-xp-roles"
			/>
			<Selector
				id="noXpRoles"
				initialItems={(settings.noXpRoles as Snowflake[] | null) ?? []}
				items={roles}
				limit={noXpRolesLimit}
				onSelect={(roleIds) => addChange("noXpRoles", roleIds)}
				type="Role"
			/>
			<Subtitle text={`Maximum of ${noXpRolesLimit} roles.`} />
		</Field>
	);
}
