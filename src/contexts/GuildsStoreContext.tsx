import { createContext, ReactNode, useState } from 'react';

import type { PartialGuild } from '../utils/retrieveUserGuilds';

interface GuildsStoreContextData {
  guilds: PartialGuild[];
  updateGuilds(value: PartialGuild[]): void;
}

interface GuildsStoreProviderProps {
  children: ReactNode;
}

export const GuildsStoreContext = createContext({} as GuildsStoreContextData);

export default function GuildsStoreProvider({ children }: GuildsStoreProviderProps) {
  const [guilds, setGuilds] = useState<PartialGuild[]>([]);

  function updateGuilds(value: PartialGuild[]) {
    setGuilds(value);
  }

  return (
    <GuildsStoreContext.Provider
      value={{
        guilds,
        updateGuilds,
      }}
    >
      {children}
    </GuildsStoreContext.Provider>
  );
}
