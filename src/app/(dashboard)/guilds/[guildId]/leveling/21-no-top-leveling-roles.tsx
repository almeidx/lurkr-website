import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { MAX_NO_TOP_XP_ROLES, MAX_NO_TOP_XP_ROLES_PREMIUM } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function NoTopLevelingRoles({ defaultValues, premium, roles }: NoTopLevelingRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	return (
		<RoleSelector
			defaultValues={defaultValue}
			inputId="no-top-leveling-roles"
			max={getMaximumLimit("noTopXpRoles", premium)}
			roles={roles}
			settingId="noTopXpRoles"
		>
			<Label sub={`Max. ${MAX_NO_TOP_XP_ROLES} - Max. ${MAX_NO_TOP_XP_ROLES_PREMIUM} for Premium`}>Roles</Label>
		</RoleSelector>
	);
}

interface NoTopLevelingRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
