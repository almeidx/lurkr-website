import { createContext, ReactNode } from 'react';

interface GuildChangesContextData {}

interface GuildChangesContextProps {
  children: ReactNode;
}

export const GuildChangesContext = createContext({} as GuildChangesContextData);

export default function GuildChangeProvider({ children }: GuildChangesContextProps) {
  return <GuildChangesContext.Provider value={{}}>{children}</GuildChangesContext.Provider>;
}
