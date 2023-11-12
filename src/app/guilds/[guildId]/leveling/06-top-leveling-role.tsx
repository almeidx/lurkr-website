"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { useMemo } from "react";

export function TopLevelingRole({ defaultValue, roles }: AllTimeLeaderboardChampionProps) {
	const defaultValues = useMemo(() => {
		const role = defaultValue && roles.find((role) => role.id === defaultValue);
		return role ? [{ ...role, resolvedColor: decimalRoleColorToHex(role.color) }] : [];
	}, [roles, defaultValue]);

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
