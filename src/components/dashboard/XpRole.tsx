import { MdClear } from "react-icons/md";
import type { Role } from "../../contexts/GuildContext";
import { getDatabaseLimit } from "../../utils/common";
import type { Snowflake } from "../../utils/constants";
import Selector from "../form/Selector";

export type XpRoleOnChangeFn = (roleIds: Snowflake[], level: number) => unknown;

interface XpRoleProps {
	disabled?: boolean;
	initialRoles: Snowflake[];
	level: number;
	onChange: XpRoleOnChangeFn;
	premium: boolean;
	roles: Role[];
}

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

				<MdClear
					onClick={() => onChange([], level)}
					className="ml-auto mt-0 h-8 w-8 cursor-pointer py-1 text-red-500"
				/>
			</div>

			<div className="w-full">
				<Selector
					id={`l-${level}-roles`}
					disabled={disabled}
					limit={getDatabaseLimit("xpRolesPerLevel", premium).maxLength}
					initialItems={initialRoles}
					items={roles}
					onSelect={(roleIds) => onChange(roleIds, level)}
					type="Role"
				/>
			</div>
		</div>
	);
}
