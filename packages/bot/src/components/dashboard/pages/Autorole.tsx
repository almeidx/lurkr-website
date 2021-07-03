import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useState } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { DatabaseGuild, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import { formatNumberToNDecimalPlaces } from '../../../utils/utils';
import Field from '../../Form/Field';
import Fieldset from '../../Form/Fieldset';
import Input from '../../Form/Input';
import Label from '../../Form/Label';
import Selector, { OnSelectFn } from '../../Form/Selector';
import Header from '../Header';

interface AutoroleProps {
  database: DatabaseGuild | null;
  roles: Role[];
}

export default function Autorole({ database, roles }: AutoroleProps) {
  const [autoRoles, setAutoRoles] = useState<Snowflake[]>(database?.autoRole ?? []);
  const [autoRoleTimeout, setAutoRoleTimeout] = useState(
    formatNumberToNDecimalPlaces((database?.autoRoleTimeout ?? 0) / 60_000),
  );
  const { addChange } = useContext(GuildContext);

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

      <Fieldset>
        <Field>
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
        </Field>

        <Field>
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
        </Field>
      </Fieldset>
    </>
  );
}
