import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function OnJoinRoles({ defaultValues, premium, roles }: OnJoinRolesProps) {
	return (
		<RoleSelector
			defaultValues={mapRoleIdsToRoles(defaultValues, roles)}
			inputId="on-join-roles"
			max={limitFor("autoRole", premium)}
			roles={roles}
			settingId="autoRole"
		>
			<Label sub={limitLabel("autoRole")}>Roles</Label>
		</RoleSelector>
	);
}

interface OnJoinRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
