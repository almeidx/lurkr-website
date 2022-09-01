import { MdClear } from "react-icons/md";
import type { DashboardRoles } from "../../graphql/queries/DashboardGuild";
import type { Snowflake } from "../../utils/constants";
import { getDatabaseLimit } from "../../utils/utils";
import Selector from "../form/Selector";

export type XpRoleOnChangeFn = (roleIds: Snowflake[], level: number) => unknown;

interface XpRoleProps {
	disabled?: boolean;
	initialRoles: Snowflake[];
	level: number;
	onChange: XpRoleOnChangeFn;
	premium: boolean;
	roles: DashboardRoles;
}

export default function XpRole({ level, initialRoles, onChange, premium, roles, disabled }: XpRoleProps) {
	return (
		<div className="flex flex-col items-center justify-between gap-y-2 rounded-lg bg-discord-dark py-2 px-4 shadow-lg">
			<div className="flex w-full">
				<label
					className="mr-2 flex shrink-0 items-center justify-center rounded-full bg-discord-not-quite-black px-4 text-white shadow-lg"
					htmlFor={`l-${level}-roles`}
				>
					Level {level}
				</label>
				<MdClear onClick={() => onChange([], level)} className="ml-auto h-12 w-8 cursor-pointer py-3 text-red-500" />
			</div>
			<div className="w-full">
				<Selector
					id={`l-${level}-roles`}
					disabled={disabled}
					limit={getDatabaseLimit("xpRolesPerLevel", premium).maxLength}
					initialItems={initialRoles}
					items={roles}
					onSelect={(roleIds) => onChange(roleIds, level)}
					type="role"
				/>
			</div>
		</div>
	);
}
