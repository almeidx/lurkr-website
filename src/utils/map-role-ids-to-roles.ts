import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function mapRoleIdsToRoles(roleIds: Snowflake[] | Snowflake | null, roles: Role[]) {
	const roleIdsArray = Array.isArray(roleIds) ? roleIds : roleIds ? [roleIds] : [];

	return roleIdsArray
		.map((id) => {
			const role = roles.find((role) => role.id === id);
			return role ? { ...role, resolvedColor: decimalRoleColorToHex(role.color) } : null;
		})
		.filter((role) => role !== null);
}
