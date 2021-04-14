import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types';

interface Guild {
  icon: string | null;
  id: Snowflake;
  name: string;
  permissions: string;
}

export interface UserGuilds {
  getUserGuilds: Guild[] | null;
}

export default gql`
  query {
    getUserGuilds {
      icon
      id
      name
      permissions
    }
  }
`;
