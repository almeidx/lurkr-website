import axios from 'axios';
import type { Snowflake } from 'discord-api-types';
import cloneDeep from 'lodash.clonedeep';
import { createContext, ReactNode, useCallback, useState } from 'react';

import type { DatabaseChanges } from '../graphql/mutations/updateDatabaseGuild';
import type { DashboardDatabaseGuild } from '../graphql/queries/DashboardGuild';
import { API_BASE_URL, DATABASE_LIMITS, VANITY_REGEX } from '../utils/constants';
import { getDatabaseLimit } from '../utils/utils';

export type Section =
  | 'general'
  | 'leveling'
  | 'autorole'
  | 'milestones'
  | 'emojiList'
  | 'mentionCooldown'
  | 'miscellaneous';

interface VanityCheckResponse {
  available: boolean;
}

const emojiListKeys: (keyof DatabaseChanges)[] = ['emojiListChannel'];

const levelingKeys: (keyof DatabaseChanges)[] = [
  'noXpRoles',
  'stackXpRoles',
  'topXpRole',
  'xpBlacklistedChannels',
  'xpMessage',
  'xpMultipliers',
  'xpResponseType',
  'xpWhitelistedChannels',
];

const milestonesKeys: (keyof DatabaseChanges)[] = [
  'milestonesChannel',
  'milestonesInterval',
  'milestonesMessage',
  'milestonesRoles',
];

interface GuildContextData {
  addChange: <T extends keyof DatabaseChanges>(key: T, value: DatabaseChanges[T]) => void;
  changes: Partial<DatabaseChanges>;
  clearChanges: () => void;
  data: DatabaseChanges | null;
  errors: string[];
  guildId: Snowflake | null;
  section: Section;
  updateData: (newData: DashboardDatabaseGuild) => void;
  updateGuildId: (newId: Snowflake) => void;
  updateSection: (newSection: Section) => void;
  warnings: string[];
}

interface GuildContextProps {
  children: ReactNode;
}

export const GuildContext = createContext({} as GuildContextData);

let vanityAvailabilityTimeout: NodeJS.Timeout | undefined;

export default function GuildContextProvider({ children }: GuildContextProps) {
  const [guildId, setGuildId] = useState<Snowflake | null>(null);
  const [section, setSection] = useState<Section>('general');
  const [changes, setChanges] = useState<Partial<DatabaseChanges>>({});
  const [data, setData] = useState<DashboardDatabaseGuild | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const addNewError = useCallback((error: string) => setErrors((prevErrors) => [...prevErrors, error]), []);

  const updateErrorsAndWarnings = useCallback(
    (changes: Partial<DatabaseChanges>, data: DashboardDatabaseGuild | null) => {
      if (!Object.keys(changes).length) {
        setErrors([]);
        setWarnings([]);
        return;
      }

      const newErrors: string[] = [];
      const newWarnings: string[] = [];
      const getLimit = <K extends keyof typeof DATABASE_LIMITS>(key: K): typeof DATABASE_LIMITS[K] =>
        getDatabaseLimit(key, data?.premium ?? false);

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
        validateMinutes(changes.autoRoleTimeout!, getLimit('autoRoleTimeout'), 'auto role timeout');
      }

      if ('mentionCooldown' in changes) {
        if (!changes.mentionCooldown) newErrors.push('The mention cooldown cannot be empty.');
        else validateMinutes(changes.mentionCooldown, getLimit('mentionCooldown'), 'mention cooldown');
      }

      if ('milestonesInterval' in changes) {
        const milestonesIntervalLimits = getLimit('milestonesInterval');
        if (Number.isNaN(changes.milestonesInterval)) newErrors.push('The milestones interval is not a valid number.');
        else if (!changes.milestonesInterval || changes.milestonesInterval < milestonesIntervalLimits.min) {
          newErrors.push(`The milestones interval is smaller than ${milestonesIntervalLimits.min}.`);
        } else if (changes.milestonesInterval > milestonesIntervalLimits.max) {
          newErrors.push(`The milestones interval is larger than ${milestonesIntervalLimits.max}.`);
        }
      }

      if ('prefix' in changes && (!changes.prefix || changes.prefix.length < 1)) {
        newErrors.push('The prefix cannot be empty.');
      }

      if (typeof changes.vanity === 'string' && changes.vanity !== '') {
        const vanityLimits = getLimit('vanity');
        if (changes.vanity.length < vanityLimits.minLength) {
          newErrors.push(`The leveling leaderboard vanity is shorter than ${vanityLimits.minLength} characters.`);
        } else if (changes.vanity.length > vanityLimits.maxLength) {
          newErrors.push(`The leveling leaderboard vanity is longer than ${vanityLimits.maxLength} characters.`);
        } else if (!VANITY_REGEX.test(changes.vanity)) {
          newErrors.push('The leveling leaderboard vanity can only contain alphanumeric characters.');
        } else {
          if (vanityAvailabilityTimeout) {
            clearTimeout(vanityAvailabilityTimeout);
          }

          vanityAvailabilityTimeout = setTimeout(() => {
            axios
              .get<VanityCheckResponse>('/vanity/check', {
                baseURL: API_BASE_URL,
                params: {
                  vanity: changes.vanity,
                },
              })
              .then((res) => {
                if (!res.data.available) addNewError('The leaderboard vanity you used is not available.');
              })
              .catch((err) => console.error('vanity availability check error: ', err));
          }, 1000);
        }
      }

      const xpMessageLimits = getLimit('xpMessage');
      if (changes.xpMessage && changes.xpMessage.length > xpMessageLimits.maxLength) {
        newErrors.push(`The xp message is longer than ${xpMessageLimits.maxLength} characters.`);
      }

      if (
        changes.xpMultipliers &&
        changes.xpMultipliers.length > 0 &&
        changes.xpMultipliers.some(({ multiplier }) => Number.isNaN(multiplier))
      ) {
        newErrors.push('One of the XP Multipliers has an invalid multiplier value.');
      }

      if (changes.xpMultipliers) {
        validateArray(changes.xpMultipliers, 5, 'xp multipliers');
      }

      if (changes.xpRoles && Object.values(changes.xpRoles).some((r) => r.length === 0)) {
        newErrors.push('One of the XP Roles is empty.');
      }

      if (data) {
        if (
          emojiListKeys.some((k) => k in changes) &&
          ('emojiList' in changes ? !changes.emojiList : !data.emojiList)
        ) {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const addChange = useCallback(
    <T extends keyof DatabaseChanges>(key: T, value: DatabaseChanges[T]) => {
      const clone = cloneDeep<Partial<DatabaseChanges>>(changes);

      if (
        data &&
        (data[key] === value ||
          (Array.isArray(value) && !value.length && data[key] === null) ||
          (Array.isArray(data[key]) && !(data[key] as any[]).length && value === null) ||
          (data[key] === null && value === 0) ||
          (data[key] === 0 && value === null))
      ) {
        if (key in clone) {
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
