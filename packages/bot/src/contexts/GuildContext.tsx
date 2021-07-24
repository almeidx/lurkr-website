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

const emojiListKeys: (keyof DatabaseGuild)[] = ['emojiListChannel'];

const levelingKeys: (keyof DatabaseGuild)[] = [
  'noXpRoles',
  'stackXpRoles',
  'topXpRole',
  'xpBlacklistedChannels',
  'xpMessage',
  'xpMultipliers',
  'xpResponseType',
  'xpWhitelistedChannels',
];

const milestonesKeys: (keyof DatabaseGuild)[] = [
  'milestonesChannel',
  'milestonesInterval',
  'milestonesMessage',
  'milestonesRoles',
];

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
  warnings: string[];
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
  const [warnings, setWarnings] = useState<string[]>([]);

  const updateErrorsAndWarnings = useCallback((changes: Partial<DatabaseGuild>, data: DatabaseGuild | null) => {
    if (!Object.keys(changes).length) {
      setErrors([]);
      setWarnings([]);
      return;
    }

    const newErrors: string[] = [];
    const newWarnings: string[] = [];

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
      if (!changes.mentionCooldown) newErrors.push('The mention cooldown cannot be empty.');
      else validateMinutes(changes.mentionCooldown, DATABASE_LIMITS.mentionCooldown, 'mention cooldown');
    }

    if ('milestonesInterval' in changes) {
      if (Number.isNaN(changes.milestonesInterval)) newErrors.push('The milestones interval is not a valid number.');
      else if (!changes.milestonesInterval || changes.milestonesInterval < DATABASE_LIMITS.milestonesInterval.min) {
        newErrors.push(`The milestones interval is smaller than ${DATABASE_LIMITS.milestonesInterval.min}.`);
      } else if (changes.milestonesInterval > DATABASE_LIMITS.milestonesInterval.max) {
        newErrors.push(`The milestones interval is larger than ${DATABASE_LIMITS.milestonesInterval.max}.`);
      }
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

    if (data) {
      if (emojiListKeys.some((k) => k in changes) && ('emojiList' in changes ? !changes.emojiList : !data.emojiList)) {
        newWarnings.push('You have made changes to the emoji list settings but the emoji list module is disabled.');
      }

      if (levelingKeys.some((k) => k in changes) && ('levels' in changes ? !changes.levels : !data.levels)) {
        newWarnings.push('You have made changes to the leveling settings but the leveling module is disabled.');
      }

      if (
        milestonesKeys.some((k) => k in changes) &&
        ('storeMilestones' in changes ? !changes.storeMilestones : !data.storeMilestones)
      ) {
        newWarnings.push('You have made changes to the milestones settings but the milestones module is disabled.');
      }
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
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
          updateErrorsAndWarnings(clone, data);
        }
        return;
      }

      clone[key] = value;
      setChanges(clone);
      updateErrorsAndWarnings(clone, data);
    },
    [changes, data, updateErrorsAndWarnings],
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
        warnings,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}
