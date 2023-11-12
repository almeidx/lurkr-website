"use client";

import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector, type RoleWithResolvedColor } from "@/components/dashboard/RoleSelector.tsx";
import { MAX_NO_ROLE_REWARD_ROLES, MAX_NO_ROLE_REWARD_ROLES_PREMIUM } from "@/lib/guild-config.ts";
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
				<Label sub={`Max. ${MAX_NO_ROLE_REWARD_ROLES} - Max. ${MAX_NO_ROLE_REWARD_ROLES_PREMIUM} for Premium`}>
					Add roles that will <span className="font-semibold tracking-tight text-white">prevent</span> users getting any
					role rewards…
				</Label>

				<DocsBubble
					path="/guides/leveling-role-rewards#adding-the-no-role-reward-roles"
					tooltip="Select roles that, irrespective of other roles a member holds, will prevent them from receiving role rewards."
				/>
			</div>
		</RoleSelector>
	);
}

interface NoRoleRewardsRolesProps {
	readonly defaultValues: string[];
	readonly premium: boolean;
	readonly roles: Role[];
}
