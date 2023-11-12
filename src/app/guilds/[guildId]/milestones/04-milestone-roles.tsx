"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector, type RoleWithResolvedColor } from "@/components/dashboard/RoleSelector.tsx";
import { MAX_MILESTONES_ROLES, MAX_MILESTONES_ROLES_PREMIUM } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { useMemo } from "react";

export function MilestoneRoles({ defaultValues, premium, roles }: MilestoneRolesProps) {
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
