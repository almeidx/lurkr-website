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
  addChange: <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => unknown;
  changes: Partial<DatabaseGuild>;
  guildId: Snowflake | null;
  section: Section;
  updateGuildId: (id: Snowflake) => unknown;
  updateSection: (newSection: Section) => unknown;
}

interface GuildContextProps {
  children: ReactNode;
}

export const GuildContext = createContext({} as GuildContextData);

export default function GuildContextProvider({ children }: GuildContextProps) {
  const [guildId, setGuildId] = useState<Snowflake | null>(null);
  const [section, setSection] = useState<Section>('general');
  const [changes, setChanges] = useState<Partial<DatabaseGuild>>({});

  const addChange = useCallback(
    <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => {
      const clone = JSON.parse(JSON.stringify(changes));
      clone[key] = value;
      setChanges(clone);
    },
    [changes],
  );

  return (
    <GuildContext.Provider
      value={{
        addChange,
        changes,
        guildId,
        section,
        updateGuildId: setGuildId,
        updateSection: setSection,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}
