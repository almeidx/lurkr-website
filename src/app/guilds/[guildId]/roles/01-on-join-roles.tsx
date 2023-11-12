"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector, type RoleWithResolvedColor } from "@/components/dashboard/RoleSelector.tsx";
import { MAX_AUTO_ROLES, MAX_AUTO_ROLES_PREMIUM } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { useMemo } from "react";

export function OnJoinRoles({ defaultValues, premium, roles }: OnJoinRolesProps) {
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
			max={getMaximumLimit("autoRole", premium)}
			roles={roles}
			settingId="autoRole"
		>
			<Label sub={`Max. ${MAX_AUTO_ROLES} - Max. ${MAX_AUTO_ROLES_PREMIUM} for Premium`}>Roles</Label>
		</RoleSelector>
	);
}

interface OnJoinRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
