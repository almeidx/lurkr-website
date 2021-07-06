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
    <div className="flex flex-row justify-between gap-3 px-3 pt-4 pb-2 first-of-type:pt-0 last-of-type:pb-0 relative w-full">
      <div className="flex flex-row gap-x-6">
        <div className="flex justify-center items-center w-7">
          <label
            className="text-white px-3 py-1 rounded-full w-8 flex justify-center items-center bg-discord-not-quite-black"
            htmlFor={`level-${level}-roles`}
          >
            {level}
          </label>
        </div>

        <Selector
          id={`level-${level}-roles`}
          limit={25}
          initialItems={initialRoles}
          items={roles}
          onSelect={(r) => onChange(r, level)}
          type="role"
        />
      </div>

      <div
        className="absolute right-0 my-auto mx-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
        onClick={() => onChange([], level)}
      >
        <MdClear />
      </div>
    </div>
  );
}
