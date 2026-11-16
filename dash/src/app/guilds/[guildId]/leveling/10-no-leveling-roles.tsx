import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function NoLevelingRoles({ defaultValues, premium, roles }: NoLevelingRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	return (
		<RoleSelector
			defaultValues={defaultValue}
			inputId="no-leveling-roles"
			max={limitFor("noXpRoles", premium)}
			roles={roles}
			settingId="noXpRoles"
		>
			<Label sub={limitLabel("noXpRoles")}>Roles</Label>
		</RoleSelector>
	);
}

interface NoLevelingRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
