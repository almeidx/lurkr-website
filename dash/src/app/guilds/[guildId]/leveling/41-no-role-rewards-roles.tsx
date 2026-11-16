import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function NoRoleRewardsRoles({ defaultValues, premium, roles }: NoRoleRewardsRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	return (
		<RoleSelector
			defaultValues={defaultValue}
			inputId="no-role-rewards-roles"
			max={limitFor("noRoleRewardRoles", premium)}
			roles={roles}
			settingId="noRoleRewardRoles"
		>
			<div className="flex items-center">
				<Label sub={limitLabel("noRoleRewardRoles")}>
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
