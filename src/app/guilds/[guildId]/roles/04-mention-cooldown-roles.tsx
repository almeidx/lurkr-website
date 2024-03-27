"use client";

import { RoleSelector, type RoleWithResolvedColor } from "@/components/dashboard/RoleSelector.tsx";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { useMemo } from "react";

export function MentionCooldownRoles({ defaultValues, premium, roles }: MentionCooldownRolesProps) {
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
			inputId="mention-cooldown-roles"
			max={getMaximumLimit("mentionCooldownRoles", premium)}
			roles={roles}
			settingId="mentionCooldownRoles"
		>
			<div className="flex items-end gap-2">
				<p className="text-lg tracking-tight text-white/75 md:text-xl">Roles</p>
				<p className="mb-1 text-xs font-light text-white/50">(Max. 25)</p>
			</div>
		</RoleSelector>
	);
}

interface MentionCooldownRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
