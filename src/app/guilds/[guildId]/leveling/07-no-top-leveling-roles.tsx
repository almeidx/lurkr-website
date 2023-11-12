import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector, type RoleWithResolvedColor } from "@/components/dashboard/RoleSelector.tsx";
import { MAX_NO_TOP_XP_ROLES, MAX_NO_TOP_XP_ROLES_PREMIUM } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { useMemo } from "react";

export function NoTopLevelingRoles({ defaultValues, premium, roles }: NoTopLevelingRolesProps) {
	const defaultValue = useMemo(
		() =>
			defaultValues
				.map((id) => {
					const role = roles.find((role) => role.id === id);
					return role ? { ...role, resolvedColor: decimalRoleColorToHex(role.color) } : null;
				})
				.filter(Boolean) as RoleWithResolvedColor[],
		[roles, defaultValues],
	);

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
