import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function NoTopLevelingRoles({ defaultValues, premium, roles }: NoTopLevelingRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	return (
		<RoleSelector
			defaultValues={defaultValue}
			inputId="no-top-leveling-roles"
			max={limitFor("noTopXpRoles", premium)}
			roles={roles}
			settingId="noTopXpRoles"
		>
			<Label sub={limitLabel("noTopXpRoles")}>Roles</Label>
		</RoleSelector>
	);
}

interface NoTopLevelingRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
