import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function MilestoneRoles({ defaultValues, premium, roles }: MilestoneRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	return (
		<RoleSelector
			defaultValues={defaultValue}
			inputId="on-join-roles"
			max={limitFor("milestonesRoles", premium)}
			menuPlacement="top"
			roles={roles}
			settingId="milestonesRoles"
		>
			<Label sub={limitLabel("milestonesRoles", "roles")}>Roles</Label>
		</RoleSelector>
	);
}

interface MilestoneRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
