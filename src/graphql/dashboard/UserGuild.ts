import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/common';

interface Channel {
  id: Snowflake;
  name: string;
}

interface Guild {
  icon: string | null;
  id: Snowflake;
  name: string;
  channels: Channel[];
}

interface DatabaseGuild {
  prefix: string;
  storeCounts: boolean;
}

export interface UserGuild {
  getDiscordGuild: Guild | null;
  getDatabaseGuild: DatabaseGuild | null;
}

export default gql`
  query getDiscordGuild($id: String!) {
    getDiscordGuild(id: $id, includeChannels: true) {
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
      storeCounts
    }
  }
`;
