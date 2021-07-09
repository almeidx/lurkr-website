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

interface MentionCooldownProps {
  database: DatabaseGuild;
  roles: Role[];
}

export default function MentionCooldown({ database, roles }: MentionCooldownProps) {
  const { addChange } = useContext(GuildContext);

  return (
    <>
      <Header
        description="Automatically make roles non-mentionable after being mentioned for a certain amount of time."
        title="Mention Cooldown"
      />

      <Fieldset>
        <Field>
          <Label
            htmlFor="mentionCooldown"
            name="Mention Cooldown (Minutes)"
            url="https://docs.pepemanager.com/guides/automatic-role-mention-cooldown#setting-up-the-cooldown-time"
          />
          <div className="max-w-[20rem]">
            <Input
              id="mentionCooldown"
              initialValue={formatNumberToNDecimalPlaces(database.mentionCooldown / 60_000)}
              maxLength={5}
              onChange={(t) => addChange('mentionCooldown', parseFloat(t))}
              placeholder="Enter the role mention cooldown"
            />
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="mentionCooldownRoles"
            name="Mention Cooldown Roles"
            url="https://docs.pepemanager.com/guides/automatic-role-mention-cooldown#setting-up-the-roles"
          />
          <Selector
            id="mentionCooldownRoles"
            limit={DATABASE_LIMITS.mentionCooldownRoles.maxLength}
            initialItems={database.mentionCooldownRoles ?? []}
            items={roles}
            onSelect={(r) => addChange('mentionCooldownRoles', r)}
            type="role"
          />
        </Field>
      </Fieldset>
    </>
  );
}
