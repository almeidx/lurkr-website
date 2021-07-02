import type { Snowflake } from 'discord-api-types';
import { useCallback, useState } from 'react';
import { MdClear } from 'react-icons/md';

import type { Role } from '../../graphql/queries/UserGuild';
import Selector from '../Form/Selector';

export type XpRoleOnClearFn = (level: number) => unknown;
export type XpRoleOnChangeFn = (roleId: Snowflake, level: number, type: 'add' | 'remove') => unknown;

interface XpRoleProps {
  level: number;
  initialRoles: Snowflake[];
  onClear: XpRoleOnClearFn;
  onChange: XpRoleOnChangeFn;
  roles: Role[];
}

export default function XpRole({ level, initialRoles, onClear, onChange, roles }: XpRoleProps) {
  const [levelRoles, setLevelRoles] = useState<Snowflake[]>(initialRoles);

  const handleLevelRolesChange = useCallback(
    (itemId: Snowflake, type: 'add' | 'remove') => {
      const clone = [...levelRoles];
      if (type === 'add') {
        onChange(itemId, level, 'add');
        return setLevelRoles([...clone, itemId]);
      }

      const roleIndex = clone.findIndex((i) => itemId === i);
      if (roleIndex < 0) return console.error("[XpRole] Couldn't find item index when user tried removing an item");

      onChange(itemId, level, 'remove');
      clone.splice(roleIndex, 1);
      return setLevelRoles(clone);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelRoles, level],
  );

  return (
    <div className="flex flex-row justify-between gap-3 px-3 py-2 relative w-full">
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
          onSelect={handleLevelRolesChange}
          type="role"
        />
      </div>

      <div
        className="absolute right-0 my-auto mx-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
        onClick={() => onClear(level)}
      >
        <MdClear />
      </div>
    </div>
  );
}
