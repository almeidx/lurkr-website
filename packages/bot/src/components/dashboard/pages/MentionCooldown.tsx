import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useState } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { DatabaseGuild, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import { formatNumberToNDecimalPlaces } from '../../../utils/utils';
import Field from '../../Form/Field';
import Fieldset from '../../Form/Fieldset';
import Input from '../../Form/Input';
import Label from '../../Form/Label';
import Selector, { OnSelectFn } from '../../Form/Selector';
import Header from '../Header';

interface MentionCooldownProps {
  database: DatabaseGuild | null;
  roles: Role[];
}

export default function MentionCooldown({ database, roles }: MentionCooldownProps) {
  const [mentionCooldown, setMentionCooldown] = useState<string>(
    formatNumberToNDecimalPlaces((database?.mentionCooldown ?? DATABASE_DEFAULTS.mentionCooldown) / 60_000),
  );
  const [mentionCooldownRoles, setMentionCooldownRoles] = useState<Snowflake[]>(database?.mentionCooldownRoles ?? []);
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
        </Field>

        <Field>
          <Label htmlFor="mentionCooldownRoles" name="Emoji List Channel" url="#" />
          <Selector
            id="mentionCooldownRoles"
            limit={DATABASE_LIMITS.mentionCooldownRoles.maxLength}
            initialItems={database?.mentionCooldownRoles ?? []}
            items={roles}
            onSelect={handleMentionCooldownRolesChange}
            type="role"
          />
        </Field>
      </Fieldset>
    </>
  );
}
