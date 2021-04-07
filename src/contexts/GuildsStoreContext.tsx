import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v8';
import { createContext, ReactNode, useCallback, useState } from 'react';

interface GuildsStoreContextData {
  guilds: RESTAPIPartialCurrentUserGuild[];
  updateGuilds(value: RESTAPIPartialCurrentUserGuild[]): void;
}

interface GuildsStoreProviderProps {
  children: ReactNode;
}

export const GuildsStoreContext = createContext({} as GuildsStoreContextData);

export default function GuildsStoreProvider({ children }: GuildsStoreProviderProps) {
  const [guilds, setGuilds] = useState<RESTAPIPartialCurrentUserGuild[]>([]);

  const updateGuilds = useCallback((value: RESTAPIPartialCurrentUserGuild[]) => {
    setGuilds(value);
  }, []);

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
