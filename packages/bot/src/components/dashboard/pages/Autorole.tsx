import { useContext, useState } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { DatabaseGuild, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import { formatNumberToNDecimalPlaces } from '../../../utils/utils';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Header from '../Header';

interface AutoroleProps {
  database: DatabaseGuild;
  roles: Role[];
}

export default function Autorole({ database, roles }: AutoroleProps) {
  const [autoRoleTimeout, setAutoRoleTimeout] = useState(
    formatNumberToNDecimalPlaces(database.autoRoleTimeout / 60_000),
  );
  const { addChange } = useContext(GuildContext);

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
            initialItems={database.autoRole ?? []}
            items={roles}
            onSelect={(roleIds) => addChange('autoRole', roleIds)}
            type="role"
          />
        </Field>

        <Field>
          <Label
            htmlFor="autoRoleTimeout"
            name="Autorole Timeout (Minutes)"
            url="https://docs.pepemanager.com/guides/automatically-added-roles-with-timeout#setting-your-timeout"
          />
          <div className="max-w-[20rem]">
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
        </Field>
      </Fieldset>
    </>
  );
}
