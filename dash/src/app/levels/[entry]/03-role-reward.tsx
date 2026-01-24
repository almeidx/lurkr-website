import { Chip } from "@heroui/react";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";

export function RoleRewardDisplay({ level, roles }: RoleReward) {
	return (
		<div className="rounded-lg border border-white/10 bg-white/5 p-3">
			<div className="mb-2 flex items-center gap-2">
				<div className="flex size-6 items-center justify-center rounded-md bg-primary/20 font-semibold text-primary text-xs">
					{level}
				</div>
				<span className="font-medium text-white/60 text-xs">Level {level} Rewards</span>
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
