import type { Snowflake } from 'discord-api-types';
import { MdClear } from 'react-icons/md';

import type { Role } from '../../graphql/queries/DashboardGuild';
import { getDatabaseLimit } from '../../utils/utils';
import Selector from '../form/Selector';

export type XpRoleOnChangeFn = (roleIds: Snowflake[], level: number) => unknown;

interface XpRoleProps {
  level: number;
  disabled?: boolean;
  initialRoles: Snowflake[];
  premium: boolean;
  onChange: XpRoleOnChangeFn;
  roles: Role[];
}

export default function XpRole({ level, initialRoles, onChange, premium, roles, disabled }: XpRoleProps) {
  return (
    <div className="flex flex-col justify-between items-center px-4 py-2 gap-y-2 bg-discord-dark shadow-lg rounded-lg">
      <div className="flex w-full">
        <label
          className="flex flex-shrink-0 justify-center items-center rounded-full px-4 mr-2 text-white bg-discord-not-quite-black shadow-lg"
          htmlFor={`l-${level}-roles`}
        >
          Level {level}
        </label>
        <MdClear onClick={() => onChange([], level)} className="h-12 w-8 py-3 ml-auto text-red-500 cursor-pointer" />
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
