import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import type { Role } from "@/lib/guild.ts";
import { MAX_MILESTONES_ROLES, MAX_MILESTONES_ROLES_PREMIUM } from "@/lib/guild-config.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function MilestoneRoles({ defaultValues, premium, roles }: MilestoneRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	return (
		<RoleSelector
			defaultValues={defaultValue}
			inputId="on-join-roles"
			max={getMaximumLimit("milestonesRoles", premium)}
			menuPlacement="top"
			roles={roles}
			settingId="milestonesRoles"
		>
			<Label sub={`Max. ${MAX_MILESTONES_ROLES} roles - Max. ${MAX_MILESTONES_ROLES_PREMIUM} for Premium`}>Roles</Label>
		</RoleSelector>
	);
}

interface MilestoneRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
