import type { Snowflake } from 'discord-api-types';
import { useCallback, useState } from 'react';

import type { DatabaseGuild, Role } from '../../../graphql/queries/UserGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import Input from '../../Input';
import Header from '../Header';
import Label from '../Label';
import Selector, { OnSelectFn } from '../Selector';

interface MentionCooldownProps {
  database: DatabaseGuild | null;
  roles: Role[];
}

export default function MentionCooldown({ database, roles }: MentionCooldownProps) {
  const [mentionCooldown, setMentionCooldown] = useState<string>(
    (database?.mentionCooldown ?? DATABASE_DEFAULTS.mentionCooldown).toString(),
  );
  const [mentionCooldownRoles, setMentionCooldownRoles] = useState<Snowflake[]>(database?.mentionCooldownRoles ?? []);

  const handleMentionCooldownRolesChange: OnSelectFn = useCallback(
    (roleId, type) => {
      if (type === 'add') {
        return setMentionCooldownRoles([...mentionCooldownRoles, roleId]);
      }

      const clone = [...mentionCooldownRoles];
      const roleIndex = clone.findIndex((i) => roleId === i);
      if (roleIndex < 0) return;

      clone.splice(roleIndex, 1);
      return setMentionCooldownRoles(clone);
    },
    [mentionCooldownRoles],
  );

  return (
    <>
      <Header
        description="Automatically make roles non-mentionable after being mentioned for a certain amount of time."
        title="Mention Cooldown"
      />

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="mentionCooldown" name="Mention Cooldown (Minutes)" url="#" />

          <Input
            id="mentionCooldown"
            maxLength={5}
            onChange={({ target }) => setMentionCooldown(target.value)}
            onClear={() => setMentionCooldown('')}
            placeholder="Enter the role mention cooldown"
            value={mentionCooldown}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="mentionCooldownRoles" name="Emoji List Channel" url="#" />

          <Selector
            id="mentionCooldownRoles"
            limit={DATABASE_LIMITS.mentionCooldownRoles.maxLength}
            initialItems={database?.mentionCooldownRoles ?? []}
            items={roles}
            onSelect={handleMentionCooldownRolesChange}
            type="role"
          />
        </div>
      </div>
    </>
  );
}
