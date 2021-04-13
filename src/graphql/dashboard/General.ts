import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/common';

import type { DatabaseGuild } from '../../contexts/GuildContext';

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

export interface General {
  getDiscordGuild: Guild | null;
  getDatabaseGuild: Pick<DatabaseGuild, 'prefix'> | null;
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
    }
  }
`;
