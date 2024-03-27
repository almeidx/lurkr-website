"use client";

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
			<div className="flex items-end gap-2">
				<p className="text-lg tracking-tight text-white/75 md:text-xl">Role</p>
				<p className="mb-1 text-xs font-light text-white/50">(Max. 1)</p>
			</div>
		</RoleSelector>
	);
}

interface AllTimeLeaderboardChampionProps {
	readonly defaultValue: Snowflake | null;
	readonly roles: Role[];
}
