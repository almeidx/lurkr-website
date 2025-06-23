import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";

export function RoleRewardDisplay({ level, roles }: RoleReward) {
	return (
		<div className="flex items-center gap-4">
			<span className="flex size-9 items-center justify-center rounded-lg border border-white/25 bg-darker text-[#fff]">
				{level}
			</span>

			<div className="flex flex-1 flex-wrap gap-2 overflow-x-hidden">
				{roles.map((role) => (
					<RoleDisplay key={role.id} {...role} />
				))}
			</div>
		</div>
	);
}

export function RoleDisplay({ name, color }: Role) {
	const hex = decimalRoleColorToHex(color);

	return (
		<div className="flex items-center gap-1.5 rounded-md border border-white/25 px-1.5">
			<div aria-hidden className="size-3.5 rounded-full" style={{ backgroundColor: hex }} />
			<p className="truncate text-sm">{name}</p>
		</div>
	);
}

export interface RoleReward {
	readonly id: string;
	readonly level: number;
	readonly roles: Role[];
}
