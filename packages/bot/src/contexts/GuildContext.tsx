import type { Snowflake } from 'discord-api-types';
import { createContext, ReactNode, useCallback, useState } from 'react';

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

  const addChange = useCallback(
    <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => {
      const clone: Partial<DatabaseGuild> = JSON.parse(JSON.stringify(changes));

      if (data && (data[key] === value || (Array.isArray(value) && !value.length && data[key] === null))) {
        if (key in clone) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete clone[key];
          setChanges(clone);
        }
        return;
      }

      clone[key] = value;
      setChanges(clone);
    },
    [changes, data],
  );

  const removeChange = useCallback(
    (key: keyof DatabaseGuild) => {
      const clone: Partial<DatabaseGuild> = JSON.parse(JSON.stringify(changes));

      if (key in clone) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete clone[key];
        setChanges(clone);
      }
    },
    [changes],
  );

  const clearChanges = useCallback(() => setChanges({}), []);

  return (
    <GuildContext.Provider
      value={{
        addChange,
        changes,
        clearChanges,
        data,
        guildId,
        removeChange,
        section,
        updateData: setData,
        updateGuildId: setGuildId,
        updateSection: setSection,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}
