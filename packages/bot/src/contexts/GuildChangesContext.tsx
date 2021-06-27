import type { Snowflake } from 'discord-api-types';
import { createContext, ReactNode, useState } from 'react';

export type Section = 'general' | 'leveling' | 'autorole';

interface GuildChangesContextData {
  guildId: Snowflake | null;
  section: Section;
  updateGuildId(id: Snowflake): void;
  updateSection(newSection: Section): void;
}

interface GuildChangesContextProps {
  children: ReactNode;
}

export const GuildChangesContext = createContext({} as GuildChangesContextData);

export default function GuildChangeProvider({ children }: GuildChangesContextProps) {
  const [guildId, setGuildId] = useState<Snowflake | null>(null);
  const [section, setSection] = useState<Section>('general');

  return (
    <GuildChangesContext.Provider value={{ guildId, section, updateGuildId: setGuildId, updateSection: setSection }}>
      {children}
    </GuildChangesContext.Provider>
  );
}
