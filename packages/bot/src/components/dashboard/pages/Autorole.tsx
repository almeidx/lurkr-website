import { useContext } from 'react';

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
            onSelect={(r) => addChange('autoRole', r)}
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
              initialValue={formatNumberToNDecimalPlaces(database.autoRoleTimeout / 60_000)}
              maxLength={32}
              onChange={(t) => addChange('autoRoleTimeout', parseFloat(t))}
              placeholder="Enter the autorole timeout"
            />
          </div>
        </Field>
      </Fieldset>
    </>
  );
}
