import { MdClear } from "react-icons/md";
import Selector from "@/form/Selector";
import type { Role } from "~/contexts/GuildContext";
import type { Snowflake } from "~/utils/constants";
import { MAX_XP_ROLE_REWARD_ROLES, MAX_XP_ROLE_REWARD_ROLES_PREMIUM } from "~/utils/guild-config";

export default function XpRole({ level, initialRoles, onChange, premium, roles, disabled = false }: XpRoleProps) {
	return (
		<div className="flex flex-col items-center justify-between gap-y-2 rounded-lg bg-discord-dark px-4 py-2 shadow-lg">
			<div className="flex h-8 w-full">
				<label
					className="mr-2 flex shrink-0 items-center justify-center rounded-full bg-discord-not-quite-black px-3 text-white shadow-lg"
					htmlFor={`l-${level}-roles`}
				>
					Level {level}
				</label>

				<MdClear className="ml-auto mt-0 size-8 cursor-pointer py-1 text-red-500" onClick={() => onChange([], level)} />
			</div>

			<div className="w-full">
				<Selector
					disabled={disabled}
					id={`l-${level}-roles`}
					initialItems={initialRoles}
					items={roles}
					limit={premium ? MAX_XP_ROLE_REWARD_ROLES_PREMIUM : MAX_XP_ROLE_REWARD_ROLES}
					onSelect={(roleIds) => onChange(roleIds, level)}
					type="Role"
				/>
			</div>
		</div>
	);
}

export type XpRoleOnChangeFn = (roleIds: Snowflake[], level: number) => unknown;

interface XpRoleProps {
	readonly disabled?: boolean;
	readonly initialRoles: Snowflake[];
	readonly level: number;
	readonly onChange: XpRoleOnChangeFn;
	readonly premium: boolean;
	readonly roles: Role[];
}
