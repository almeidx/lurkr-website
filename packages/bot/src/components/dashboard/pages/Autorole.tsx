import ms from '@almeidx/ms';
import type { Snowflake } from 'discord-api-types';
import { useCallback, useState } from 'react';

import type { Role, UserGuild } from '../../../graphql/queries/UserGuild';
import Input from '../../Input';
import Header from '../Header';
import Label from '../Label';
import Selector from '../Selector';

interface AutoroleProps {
  database: UserGuild['getDatabaseGuild'];
  roles: Role[];
}

export default function Autorole({ database, roles }: AutoroleProps) {
  const [autoRoles, setAutoRoles] = useState<Snowflake[]>(database?.autoRole ?? []);
  const [autoRoleTimeout, setAutoRoleTimeout] = useState(ms(database?.autoRoleTimeout ?? 0));

  const handleAutorolesChange = useCallback(
    (itemId: Snowflake, type: 'add' | 'remove') => {
      const clone = [...autoRoles];
      if (type === 'add') {
        return setAutoRoles([...clone, itemId]);
      }

      const roleIndex = clone.findIndex((i) => itemId === i);
      if (roleIndex < 0) return;

      clone.splice(roleIndex, 1);
      return setAutoRoles(clone);
    },
    [autoRoles],
  );

  return (
    <>
      <Header
        description="Autoroles consist of roles that are given to users when they join the server."
        title="Autorole"
      />

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="autoRole"
            name="Autoroles"
            url="https://docs.pepemanager.com/guides/automatically-added-roles-with-timeout"
          />

          <Selector
            limit={25}
            initialItems={database?.autoRole ?? []}
            items={roles}
            onSelect={handleAutorolesChange}
            type="role"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="autoRoleTimeout"
            name="Autorole Timeout (Minutes)"
            url="https://docs.pepemanager.com/guides/automatically-added-roles-with-timeout"
          />

          <Input
            id="autoRoleTimeout"
            maxLength={32}
            onChange={(e) => setAutoRoleTimeout(e.target.value)}
            onClear={() => setAutoRoleTimeout('')}
            placeholder="Enter the autorole timeout"
            value={autoRoleTimeout.toString()}
          />
        </div>
      </div>
    </>
  );
}
