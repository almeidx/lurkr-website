"use client";

import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { RoleSelector, type RoleWithResolvedColor } from "@/components/dashboard/RoleSelector.tsx";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { useMemo } from "react";

export function NoRoleRewardsRoles({ defaultValues, premium, roles }: NoRoleRewardsRolesProps) {
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
			inputId="no-role-rewards-roles"
			max={getMaximumLimit("noRoleRewardRoles", premium)}
			roles={roles}
			settingId="noRoleRewardRoles"
		>
			<div className="flex items-center">
				<div className="flex items-end gap-2 tracking-tight">
					<p className="text-lg text-white/75 md:text-xl">
						Add roles that will <span className="font-semibold tracking-tight text-white">prevent</span> users getting
						any role rewards…
					</p>
					<p className="mb-1 text-xs font-light text-white/50">(Max. 10 - Max. 25 for Premium)</p>
				</div>

				<DocsBubble path="/guides/setting-up-server-leveling#adding-the-no-role-reward-roles" />
			</div>
		</RoleSelector>
	);
}

interface NoRoleRewardsRolesProps {
	readonly defaultValues: string[];
	readonly premium: boolean;
	readonly roles: Role[];
}
