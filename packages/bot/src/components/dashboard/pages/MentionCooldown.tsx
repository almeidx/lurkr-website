import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useState } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { DatabaseGuild, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import { formatNumberToNDecimalPlaces } from '../../../utils/utils';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector, { OnSelectFn } from '../../form/Selector';
import Header from '../Header';

interface MentionCooldownProps {
  database: DatabaseGuild;
  roles: Role[];
}

export default function MentionCooldown({ database, roles }: MentionCooldownProps) {
  const [mentionCooldown, setMentionCooldown] = useState<string>(
    formatNumberToNDecimalPlaces(database.mentionCooldown / 60_000),
  );
  const [mentionCooldownRoles, setMentionCooldownRoles] = useState<Snowflake[]>(database.mentionCooldownRoles ?? []);
  const { addChange } = useContext(GuildContext);

  const handleMentionCooldownRolesChange: OnSelectFn = useCallback(
    (roleId, type) => {
      if (type === 'add') {
        const finalRoles = [...mentionCooldownRoles, roleId];
        setMentionCooldownRoles(finalRoles);
        return addChange('mentionCooldownRoles', finalRoles);
      }

      const clone = [...mentionCooldownRoles];
      const roleIndex = clone.findIndex((i) => roleId === i);
      if (roleIndex < 0) return;

      clone.splice(roleIndex, 1);
      setMentionCooldownRoles(clone);
      addChange('mentionCooldownRoles', clone);
    },
    [addChange, mentionCooldownRoles],
  );

  return (
    <>
      <Header
        description="Automatically make roles non-mentionable after being mentioned for a certain amount of time."
        title="Mention Cooldown"
      />
      <Fieldset>
        <Field>
          <Label htmlFor="mentionCooldown" name="Mention Cooldown (Minutes)" url="#" />
          <div className="max-w-[20rem]">
            <Input
              id="mentionCooldown"
              maxLength={5}
              onChange={({ target }) => {
                setMentionCooldown(target.value);
                addChange('mentionCooldown', parseFloat(target.value));
              }}
              onClear={() => {
                setMentionCooldown('');
                addChange('mentionCooldown', 0);
              }}
              placeholder="Enter the role mention cooldown"
              value={mentionCooldown}
            />
          </div>
        </Field>

        <Field>
          <Label htmlFor="mentionCooldownRoles" name="Emoji List Channel" url="#" />
          <Selector
            id="mentionCooldownRoles"
            limit={DATABASE_LIMITS.mentionCooldownRoles.maxLength}
            initialItems={database.mentionCooldownRoles ?? []}
            items={roles}
            onSelect={handleMentionCooldownRolesChange}
            type="role"
          />
        </Field>
      </Fieldset>
    </>
  );
}
