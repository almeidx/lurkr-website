import type { Snowflake } from 'discord-api-types';
import { MdClear } from 'react-icons/md';

import type { Role } from '../../graphql/queries/DashboardGuild';
import Selector from '../form/Selector';

export type XpRoleOnChangeFn = (roleIds: Snowflake[], level: number) => unknown;

interface XpRoleProps {
  level: number;
  initialRoles: Snowflake[];
  onChange: XpRoleOnChangeFn;
  roles: Role[];
}

export default function XpRole({ level, initialRoles, onChange, roles }: XpRoleProps) {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 bg-discord-dark shadow-lg rounded-lg">
      <label
        className="flex flex-shrink-0 justify-center items-center rounded-full w-12 h-12 mr-2 text-white bg-discord-not-quite-black shadow-lg"
        htmlFor={`level-${level}-roles`}
      >
        {level}
      </label>

      <div className="w-full">
        <Selector
          id={`level-${level}-roles`}
          limit={25}
          initialItems={initialRoles}
          items={roles}
          onSelect={(r) => onChange(r, level)}
          type="role"
        />
      </div>
      <MdClear onClick={() => onChange([], level)} className="h-12 w-8 py-3 ml-4 text-red-500 cursor-pointer" />
    </div>
  );
}
