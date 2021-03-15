import axios from 'axios';
import { createContext, ReactNode, useState } from 'react';

import { DISCORD_API_BASE_URL } from '../utils/constants';

export type User = any;

interface UserContextData {
  user: User | null;
  fetchUser(accessToken: string): void;
  updateUser(value: User): void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextData);

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  function updateUser(value: User) {
    setUser(value);
  }

  async function fetchUser(accessToken: string) {
    const { data } = await axios.get(`/users/@me/guilds`, {
      baseURL: DISCORD_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(data);
  }

  return (
    <UserContext.Provider
      value={{
        fetchUser,
        updateUser,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
