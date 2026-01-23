import { Chip } from "@heroui/react";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";

export function RoleRewardDisplay({ level, roles }: RoleReward) {
	return (
		<div className="flex items-center gap-4">
			<Chip className="shrink-0 font-semibold" size="sm" variant="flat">
				Level {level}
			</Chip>

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
		<Chip
			className="border border-white/20"
			size="sm"
			startContent={<div aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: hex }} />}
			variant="flat"
		>
			{name}
		</Chip>
	);
}

export interface RoleReward {
	readonly id: string;
	readonly level: number;
	readonly roles: Role[];
}
