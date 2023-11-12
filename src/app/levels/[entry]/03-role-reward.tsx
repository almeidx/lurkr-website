import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";

export function RoleRewardDisplay({ level, roles }: RoleReward) {
	return (
		<div className="flex items-center gap-4">
			<span className="flex size-9 items-center justify-center rounded-lg border border-white/25 bg-[#1e1f22] text-xl text-[#fff]">
				{level}
			</span>

			<div className="flex flex-1 flex-wrap gap-2">
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
		<div className="flex items-center gap-[0.2rem] rounded-[20px] border px-1" style={{ borderColor: hex }}>
			<div className="mx-[0.1rem] size-[14px] rounded-full" style={{ backgroundColor: hex }} aria-hidden="true" />
			<p className="text-sm truncate">{name}</p>
		</div>
	);
}

export interface RoleReward {
	readonly id: string;
	readonly level: number;
	readonly roles: Role[];
}
