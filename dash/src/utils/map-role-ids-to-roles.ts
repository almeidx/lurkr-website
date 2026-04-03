import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function mapRoleIdsToRoles(roleIds: Snowflake[] | Snowflake | null, roles: Role[]) {
	const roleIdsArray = Array.isArray(roleIds) ? roleIds : roleIds ? [roleIds] : [];

	return roleIdsArray.flatMap((id) => {
		const role = roles.find((r) => r.id === id);
		return role ? [{ ...role, resolvedColor: decimalRoleColorToHex(role.color) }] : [];
	});
}
