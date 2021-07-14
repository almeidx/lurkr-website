import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/v8';

interface Level {
  avatar: string | null;
  level: number;
  tag: string | null;
  userID: Snowflake;
  xp: number;
}

interface Role {
  id: Snowflake;
  name: string;
  color: number;
}

export interface GuildLevelRoles {
  level: number;
  roles: Role[];
}

export interface Levels {
  levels: Level[];
  roles: GuildLevelRoles[] | null;
}

export interface Guild {
  id: Snowflake;
  icon: string | null;
  name: string;
}

export interface GuildLevels {
  getDiscordGuild: Guild | null;
  getGuildLevels: Levels | null;
}

export interface GuildLevelsVariables {
  id: Snowflake;
}

export default gql`
  query getGuildLevelsInfo($id: String!) {
    getDiscordGuild(id: $id, requireAuth: false) {
      id
      icon
      name
    }

    getGuildLevels(id: $id, requireAuth: false) {
      levels {
        avatar
        level
        tag
        userID
        xp
      }

      roles {
        level
        roles {
          id
          name
          color
        }
      }
    }
  }
`;
