import axios from 'axios';
import type { Snowflake } from 'discord-api-types';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { API_BASE_URL } from '../utils/constants';

interface UserContextData {
  accessToken: string;
  authenticated: boolean;
  id: Snowflake;
  username: string;
  discriminator: string;
  avatar: string;
}

interface UserContextProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextData);

export default function UserProvider({ children }: UserContextProps) {
  const [userData, setUserData] = useState<UserContextData>({
    accessToken: '',
    authenticated: false,
    avatar: '',
    discriminator: '',
    id: '' as Snowflake,
    username: '',
  });

  useEffect(() => {
    if (!userData.authenticated) {
      axios
        .get<{ user: Omit<UserContextData, 'authenticated'> }>('/auth/success', {
          baseURL: API_BASE_URL,
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.user);

            setUserData({
              authenticated: true,
              ...res.data.user,
            });
          } else {
            console.error('failed to authenticate', res);
            throw new Error('failed to authenticate user');
          }
        })
        .catch((err) => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
}
