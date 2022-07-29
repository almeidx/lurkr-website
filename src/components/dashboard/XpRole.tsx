import { MdClear } from 'react-icons/md';

import type { DashboardRoles } from '../../graphql/queries/DashboardGuild';
import type { Snowflake } from '../../utils/constants';
import { getDatabaseLimit } from '../../utils/utils';
import Selector from '../form/Selector';

export type XpRoleOnChangeFn = (roleIds: Snowflake[], level: number) => unknown;

interface XpRoleProps {
  level: number;
  disabled?: boolean;
  initialRoles: Snowflake[];
  premium: boolean;
  onChange: XpRoleOnChangeFn;
  roles: DashboardRoles;
}

export default function XpRole({ level, initialRoles, onChange, premium, roles, disabled }: XpRoleProps) {
  return (
    <div className="flex flex-col gap-y-2 justify-between items-center py-2 px-4 bg-discord-dark rounded-lg shadow-lg">
      <div className="flex w-full">
        <label
          className="flex shrink-0 justify-center items-center px-4 mr-2 text-white bg-discord-not-quite-black rounded-full shadow-lg"
          htmlFor={`l-${level}-roles`}
        >
          Level {level}
        </label>
        <MdClear onClick={() => onChange([], level)} className="py-3 ml-auto w-8 h-12 text-red-500 cursor-pointer" />
      </div>
      <div className="w-full">
        <Selector
          id={`l-${level}-roles`}
          disabled={disabled}
          limit={getDatabaseLimit('xpRolesPerLevel', premium).maxLength}
          initialItems={initialRoles}
          items={roles}
          onSelect={(r) => onChange(r, level)}
          type="role"
        />
      </div>
    </div>
  );
}
