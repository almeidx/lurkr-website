import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import type { Role } from "@/lib/guild.ts";
import { MAX_MENTION_COOLDOWN_ROLES } from "@/lib/guild-config.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function MentionCooldownRoles({ defaultValues, premium, roles }: MentionCooldownRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	return (
		<RoleSelector
			defaultValues={defaultValue}
			inputId="mention-cooldown-roles"
			max={getMaximumLimit("mentionCooldownRoles", premium)}
			roles={roles}
			settingId="mentionCooldownRoles"
		>
			<Label sub={`Max. ${MAX_MENTION_COOLDOWN_ROLES}`}>Roles</Label>
		</RoleSelector>
	);
}

interface MentionCooldownRolesProps {
	readonly defaultValues: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}
