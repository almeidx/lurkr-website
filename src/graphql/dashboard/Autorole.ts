import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/common';

interface Channel {
  id: Snowflake;
  name: string;
}

export interface Role {
  color: number;
  id: Snowflake;
  name: string;
  position: number;
}

interface Guild {
  channels: Channel[];
  icon: string | null;
  id: Snowflake;
  name: string;
  roles: Role[];
}

interface DatabaseGuild {
  autoRole: string[] | null;
  autoRoleTimeout: number | null;
}

export interface Autorole {
  getDiscordGuild: Guild | null;
  getDatabaseGuild: DatabaseGuild | null;
}

export default gql`
  query getDiscordGuild($id: String!) {
    getDiscordGuild(id: $id, includeChannels: true) {
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
    }
  }
`;
