import type { Snowflake } from 'discord-api-types';
import cloneDeep from 'lodash.clonedeep';
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

import type { DatabaseGuild } from '../graphql/queries/DashboardGuild';

export type Section =
  | 'general'
  | 'leveling'
  | 'autorole'
  | 'milestones'
  | 'emojiList'
  | 'mentionCooldown'
  | 'miscellaneous';

interface GuildContextData {
  addChange: <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => void;
  changes: Partial<DatabaseGuild>;
  clearChanges: () => void;
  data: DatabaseGuild | null;
  errors: string[];
  guildId: Snowflake | null;
  removeChange: (key: keyof DatabaseGuild) => void;
  section: Section;
  updateData: (newData: DatabaseGuild) => void;
  updateGuildId: (newId: Snowflake) => void;
  updateSection: (newSection: Section) => void;
}

interface GuildContextProps {
  children: ReactNode;
}

export const GuildContext = createContext({} as GuildContextData);

export default function GuildContextProvider({ children }: GuildContextProps) {
  const [guildId, setGuildId] = useState<Snowflake | null>(null);
  const [section, setSection] = useState<Section>('general');
  const [changes, setChanges] = useState<Partial<DatabaseGuild>>({});
  const [data, setData] = useState<DatabaseGuild | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const updateErrors = useCallback((changes: Partial<DatabaseGuild>) => {
    if (!Object.keys(changes).length) return;

    const newErrors: string[] = [];

    if (
      'xpMultipliers' in changes &&
      changes.xpMultipliers &&
      changes.xpMultipliers.length > 0 &&
      changes.xpMultipliers.some(({ multiplier }) => Number.isNaN(multiplier))
    ) {
      newErrors.push('One of the XP Multipliers has an invalid multiplier value.');
    }

    if ('autoRoleTimeout' in changes && Number.isNaN(changes.autoRoleTimeout)) {
      newErrors.push('The auto role timeout is not a valid number.');
    }

    if ('milestonesInterval' in changes && Number.isNaN(changes.milestonesInterval)) {
      newErrors.push('The milestones interval is not a valid number.');
    }

    if ('mentionCooldown' in changes && Number.isNaN(changes.mentionCooldown)) {
      newErrors.push('The mention cooldown is not a valid number.');
    }

    setErrors(newErrors);
  }, []);

  const addChange = useCallback(
    <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => {
      const clone = cloneDeep<Partial<DatabaseGuild>>(changes);

      if (data && (data[key] === value || (Array.isArray(value) && !value.length && data[key] === null))) {
        if (key in clone) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete clone[key];
          setChanges(clone);
          updateErrors(clone);
        }
        return;
      }

      clone[key] = value;
      setChanges(clone);
      updateErrors(clone);
    },
    [changes, data, updateErrors],
  );

  const removeChange = useCallback(
    (key: keyof DatabaseGuild) => {
      const clone = cloneDeep<Partial<DatabaseGuild>>(changes);

      if (key in clone) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete clone[key];
        setChanges(clone);
      }
    },
    [changes],
  );

  const clearChanges = useCallback(() => setChanges({}), []);

  const updateGuildId = useCallback(
    (newId: Snowflake) => {
      if (newId !== guildId) setChanges({});
      setGuildId(newId);
    },
    [guildId],
  );

  useEffect(() => {
    const clone = cloneDeep<Partial<DatabaseGuild>>(changes);
    if (!Object.keys(clone).length) return;

    const newErrors: string[] = [];

    if (
      'xpMultipliers' in clone &&
      Array.isArray(clone.xpMultipliers) &&
      clone.xpMultipliers.length > 0 &&
      clone.xpMultipliers.some((m) => isNaN(m.multiplier))
    ) {
      newErrors.push('One of the XP Multipliers have an invalid multiplier value.');
    }

    if ('autoRoleTimeout' in clone && Number.isNaN(clone.autoRoleTimeout)) {
      console.log('autoRoleTimeout is NaN');
      newErrors.push('The auto role timeout is not a valid number.');
    }

    if ('milestonesInterval' in clone && Number.isNaN(clone.milestonesInterval)) {
      newErrors.push('The milestones interval is not a valid number.');
    }

    if (newErrors.length) setErrors(newErrors);
  }, [changes]);

  return (
    <GuildContext.Provider
      value={{
        addChange,
        changes,
        clearChanges,
        data,
        errors,
        guildId,
        removeChange,
        section,
        updateData: setData,
        updateGuildId,
        updateSection: setSection,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}
