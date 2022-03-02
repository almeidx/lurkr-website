import type { Snowflake } from 'discord-api-types/globals';
import { useContext, useEffect } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { DashboardDatabaseGuild, DashboardRoles } from '../../../graphql/queries/DashboardGuild';
import { formatNumberToNDecimalPlaces, getDatabaseLimit, parseFloatStrict } from '../../../utils/utils';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Subtitle from '../../form/Subtitle';
import Header from '../Header';

interface AutoroleProps {
  database: DashboardDatabaseGuild;
  roles: DashboardRoles;
  openMenu: () => void;
}

export default function Autorole({ database, roles, openMenu }: AutoroleProps) {
  const { addChange } = useContext(GuildContext);

  const autoRoleLimit = getDatabaseLimit('autoRole', database.premium).maxLength;
  const autoRoleTimeoutLimits = getDatabaseLimit('autoRoleTimeout', database.premium);

  useEffect(() => {
    window.scroll({ behavior: 'auto', left: 0, top: 0 });
  }, [openMenu]);

  return (
    <>
      <Header
        openMenu={openMenu}
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
            limit={autoRoleLimit}
            initialItems={(database.autoRole as Snowflake[] | null) ?? []}
            items={roles}
            onSelect={(r) => addChange('autoRole', r)}
            type="role"
          />
          <Subtitle text={`Maximum of ${autoRoleLimit} roles.`} />
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
              initialValue={
                database.autoRoleTimeout ? formatNumberToNDecimalPlaces(database.autoRoleTimeout / 60_000) : ''
              }
              maxLength={32}
              onChange={(t) => addChange('autoRoleTimeout', t ? parseFloatStrict(t) : null)}
              placeholder="Enter the autorole timeout"
            />
          </div>
          <Subtitle
            text={`Between ${autoRoleTimeoutLimits.min / 60_000} - ${autoRoleTimeoutLimits.max / 60_000} minutes.`}
          />
        </Field>
      </Fieldset>
    </>
  );
}
