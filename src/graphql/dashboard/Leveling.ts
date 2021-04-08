import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/common';

interface Channel {
  id: Snowflake;
  name: string;
}

interface Role {
  color: number;
  id: Snowflake;
  name: string;
}

interface Guild {
  channels: Channel[];
  icon: string | null;
  id: Snowflake;
  name: string;
  roles: Role[];
}

interface DatabaseGuild {
  levels: boolean;
  noXpRoles: string[] | null;
  topXpRole: string | null;
  xpBlacklistedChannels: string[] | null;
  xpMessage: string;
  xpResponseType: 'dm' | 'channel' | string | null;
  xpRoles: Map<string, string[]>;
  xpWhitelistedChannels: string[] | null;
}

export interface LevelingGuild {
  getDiscordGuild: Guild | null;
  getDatabaseGuild: DatabaseGuild | null;
}

export default gql`
  query getDiscordGuild($id: String!) {
    getDiscordGuild(id: $id, includeChannels: true) {
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
      }
    }

    getDatabaseGuild(id: $id) {
      levels
      noXpRoles
      stackXpRoles
      topXpRole
      xpBlacklistedChannels
      xpMessage
      xpResponseType
      xpRoles
      xpWhitelistedChannels
    }
  }
`;
