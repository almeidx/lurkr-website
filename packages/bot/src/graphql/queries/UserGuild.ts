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
  icon: string | null;
  id: Snowflake;
  name: string;
  channels: Channel[];
}

interface DatabaseGuild {
  prefix: string;
}

export interface UserGuild {
  getDiscordGuild: Guild | null;
  getDatabaseGuild: DatabaseGuild | null;
}

export default gql`
  query getDiscordGuild($id: String!, $includeChannels: Boolean = false) {
    getDiscordGuild(id: $id, includeChannels: $includeChannels, requireAuth: true) {
      icon
      id
      name
      channels {
        id
        name
      }
    }

    getDatabaseGuild(id: $id) {
      prefix
    }
  }
`;
