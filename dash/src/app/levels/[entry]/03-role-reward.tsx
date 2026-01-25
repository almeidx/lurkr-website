import { Chip } from "@heroui/react";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";

export function RoleRewardDisplay({ level, roles }: RoleReward) {
	return (
		<div className="rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm">
			<div className="mb-3 flex items-center gap-3">
				<span className="rounded-lg border-2 border-white/20 bg-white/10 px-3 py-1 font-black text-white/90 text-xs uppercase tracking-wider">
					Lv.{level}
				</span>
				<span className="text-2xl text-white/20">→</span>
			</div>
			<div className="flex flex-wrap gap-2">
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
		<Chip className="border border-white/20" size="sm" variant="soft">
			<div className="flex items-center gap-1.5">
				<div aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: hex }} />
				{name}
			</div>
		</Chip>
	);
}

export interface RoleReward {
	readonly id: string;
	readonly level: number;
	readonly roles: Role[];
}
