import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn, Role } from "~/contexts/GuildContext";
import type { Snowflake } from "~/utils/constants";
import { MAX_NO_XP_ROLES, MAX_NO_XP_ROLES_PREMIUM } from "~/utils/guild-config";

interface NoXpRoleProps {
	readonly addChange: AddChangeFn;
	readonly roles: Role[];
	readonly settings: GuildSettings;
}

export function NoXpRoles({ addChange, roles, settings }: NoXpRoleProps) {
	const noXpRolesLimit = settings.premium ? MAX_NO_XP_ROLES_PREMIUM : MAX_NO_XP_ROLES;

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
