import type { Snowflake } from 'discord-api-types';
import cloneDeep from 'lodash.clonedeep';
import { createContext, ReactNode, useCallback, useState } from 'react';

import type { DatabaseGuild } from '../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../utils/constants';

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
    if (!Object.keys(changes).length) return setErrors([]);

    const newErrors: string[] = [];

    const validateMinutes = (n: number | null, { min, max }: { min: number; max: number }, keyName: string): void => {
      const minMinutes = min / 60_000;
      const maxMinutes = max / 60_000;
      if (Number.isNaN(n)) newErrors.push(`The ${keyName} is not a valid number.`);
      else if (n) {
        if (n < minMinutes) newErrors.push(`The ${keyName} is smaller than ${minMinutes}.`);
        else if (n > maxMinutes) newErrors.push(`The ${keyName} is larger than ${maxMinutes}.`);
      }
    };

    const validateArray = (arr: unknown[], maxLength: number, keyName: string) =>
      arr.length > maxLength && newErrors.push(`The ${keyName} has more than ${maxLength} items`);

    if ('autoRoleTimeout' in changes) {
      validateMinutes(changes.autoRoleTimeout!, DATABASE_LIMITS.autoRoleTimeout, 'auto role timeout');
    }

    if ('mentionCooldown' in changes) {
      validateMinutes(changes.mentionCooldown!, DATABASE_LIMITS.mentionCooldown, 'mention cooldown');
    }

    if ('milestonesInterval' in changes && Number.isNaN(changes.milestonesInterval)) {
      newErrors.push('The milestones interval is not a valid number.');
    }

    if ('prefix' in changes && (!changes.prefix || changes.prefix.length < 1)) {
      newErrors.push('The prefix cannot be empty.');
    }

    if (changes.xpMessage && changes.xpMessage.length > DATABASE_LIMITS.xpMessage.maxLength) {
      newErrors.push(`The xp message is longer than ${DATABASE_LIMITS.xpMessage.maxLength} characters.`);
    }

    if (
      'xpMultipliers' in changes &&
      changes.xpMultipliers &&
      changes.xpMultipliers.length > 0 &&
      changes.xpMultipliers.some(({ multiplier }) => Number.isNaN(multiplier))
    ) {
      newErrors.push('One of the XP Multipliers has an invalid multiplier value.');
    }

    if ('xpMultipliers' in changes && changes.xpMultipliers) {
      validateArray(changes.xpMultipliers, 5, 'xp multipliers');
    }

    if ('xpRoles' in changes && changes.xpRoles && Object.values(changes.xpRoles).some((r) => r.length === 0)) {
      newErrors.push('One of the XP Roles is empty.');
    }

    setErrors(newErrors);
  }, []);

  const addChange = useCallback(
    <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => {
      const clone = cloneDeep<Partial<DatabaseGuild>>(changes);

      if (
        data &&
        (data[key] === value ||
          (Array.isArray(value) && !value.length && data[key] === null) ||
          (data[key] === null && value === 0) ||
          (data[key] === 0 && value === null))
      ) {
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
