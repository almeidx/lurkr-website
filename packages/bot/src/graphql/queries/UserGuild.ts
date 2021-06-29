import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/v8';

export interface Channel {
  id: Snowflake;
  name: string;
}

export interface Role {
  color: number;
  id: Snowflake;
  name: string;
  position: number;
}

export interface Guild {
  channels: Channel[];
  icon: string | null;
  id: Snowflake;
  name: string;
  roles: Role[];
}

interface DatabaseGuild {
  autoRole: Snowflake[] | null;
  autoRoleTimeout: number;
  blacklistedChannels: Snowflake[] | null;
  prefix: string;
}

export interface UserGuild {
  getDiscordGuild: Guild | null;
  getDatabaseGuild: DatabaseGuild | null;
}

export default gql`
  query getDiscordGuild($id: String!, $includeChannels: Boolean = false) {
    getDiscordGuild(id: $id, includeChannels: $includeChannels, requireAuth: true) {
      channels {
        id
        name
      }
      icon
      id
      name
      roles {
        color
        id
        name
        position
      }
    }

    getDatabaseGuild(id: $id) {
      autoRole
      autoRoleTimeout
      blacklistedChannels
      prefix
    }
  }
`;
