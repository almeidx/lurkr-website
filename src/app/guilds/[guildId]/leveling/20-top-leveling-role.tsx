"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function TopLevelingRole({ defaultValue, roles }: AllTimeLeaderboardChampionProps) {
	const defaultValues = mapRoleIdsToRoles(defaultValue, roles);

	return (
		<RoleSelector
			defaultValues={defaultValues}
			inputId="all-time-leaderboard-champion"
			max={1}
			roles={roles}
			settingId="topXpRole"
		>
			<Label sub="Max. 1">Role</Label>
		</RoleSelector>
	);
}

interface AllTimeLeaderboardChampionProps {
	readonly defaultValue: Snowflake | null;
	readonly roles: Role[];
}
