import { Chip } from "@heroui/react";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";

export function RoleRewardDisplay({ level, roles }: RoleReward) {
	return (
		<div className="rounded-lg border border-white/10 bg-white/5 p-3">
			<div className="mb-2 flex items-center gap-2">
				<span className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-semibold text-white/80 text-xs">
					Lv.{level}
				</span>
				<span className="text-white/30">→</span>
			</div>
			<div className="flex flex-wrap gap-1.5">
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
