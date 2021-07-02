import type { Snowflake } from 'discord-api-types';
import { createContext, ReactNode, useCallback, useState } from 'react';

import type { DatabaseGuild } from '../graphql/queries/UserGuild';

export type Section =
  | 'general'
  | 'leveling'
  | 'autorole'
  | 'milestones'
  | 'emojiList'
  | 'mentionCooldown'
  | 'miscellaneous';

interface GuildChangesContextData {
  guildId: Snowflake | null;
  section: Section;
  addChange: <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => void;
  updateGuildId: (id: Snowflake) => void;
  updateSection: (newSection: Section) => void;
}

interface GuildChangesContextProps {
  children: ReactNode;
}

export const GuildChangesContext = createContext({} as GuildChangesContextData);

export default function GuildChangeProvider({ children }: GuildChangesContextProps) {
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
    <GuildChangesContext.Provider
      value={{ addChange, guildId, section, updateGuildId: setGuildId, updateSection: setSection }}
    >
      {children}
    </GuildChangesContext.Provider>
  );
}
