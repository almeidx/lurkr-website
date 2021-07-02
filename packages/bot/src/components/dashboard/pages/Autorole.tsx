import ms from '@almeidx/ms';
import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useState } from 'react';

import { GuildChangesContext } from '../../../contexts/GuildChangesContext';
import type { Role, UserGuild } from '../../../graphql/queries/UserGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import Input from '../../Input';
import Header from '../Header';
import Label from '../Label';
import Selector, { OnSelectFn } from '../Selector';

interface AutoroleProps {
  database: UserGuild['getDatabaseGuild'];
  roles: Role[];
}

export default function Autorole({ database, roles }: AutoroleProps) {
  const [autoRoles, setAutoRoles] = useState<Snowflake[]>(database?.autoRole ?? []);
  const [autoRoleTimeout, setAutoRoleTimeout] = useState(ms(database?.autoRoleTimeout ?? 0));
  const { addChange } = useContext(GuildChangesContext);

  const handleAutorolesChange: OnSelectFn = useCallback(
    (roleId, type) => {
      if (type === 'add') {
        const finalRoles = [...autoRoles, roleId];
        setAutoRoles(finalRoles);
        return addChange('autoRole', finalRoles);
      }

      const clone = [...autoRoles];
      const roleIndex = clone.findIndex((i) => roleId === i);
      if (roleIndex < 0) return;

      clone.splice(roleIndex, 1);
      setAutoRoles(clone);
      addChange('autoRole', clone);
    },
    [addChange, autoRoles],
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
            id="autoRole"
            limit={DATABASE_LIMITS.autoRole.maxLength}
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
            url="https://docs.pepemanager.com/guides/automatically-added-roles-with-timeout#setting-your-timeout"
          />

          <Input
            id="autoRoleTimeout"
            maxLength={32}
            onChange={({ target }) => {
              setAutoRoleTimeout(target.value);
              addChange('autoRoleTimeout', parseFloat(target.value));
            }}
            onClear={() => {
              setAutoRoleTimeout('');
              addChange('autoRoleTimeout', 0);
            }}
            placeholder="Enter the autorole timeout"
            value={autoRoleTimeout.toString()}
          />
        </div>
      </div>
    </>
  );
}
