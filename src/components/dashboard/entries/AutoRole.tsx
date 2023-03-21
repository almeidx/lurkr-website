import { MAX_AUTO_ROLES, MAX_AUTO_ROLES_PREMIUM } from "../../../utils/guild-config";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { Role, GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import type { Snowflake } from "~/utils/constants";

interface AutoRoleProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function AutoRole({ addChange, roles, settings }: AutoRoleProps) {
	const autoRoleLimit = settings.premium ? MAX_AUTO_ROLES_PREMIUM : MAX_AUTO_ROLES;

	return (
		<Field>
			<Label
				htmlFor="autoRole"
				name="On Join Roles"
				url="https://docs.lurkr.gg/guides/automatically-added-roles-with-timeout"
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
