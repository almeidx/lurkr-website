"use client";

import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { MAX_NO_ROLE_REWARD_ROLES, MAX_NO_ROLE_REWARD_ROLES_PREMIUM } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function NoRoleRewardsRoles({ defaultValues, premium, roles }: NoRoleRewardsRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

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
					Add roles that will <span className="font-semibold text-white tracking-tight">prevent</span> users getting any
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
