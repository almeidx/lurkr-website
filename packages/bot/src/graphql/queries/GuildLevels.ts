import type { Snowflake } from 'discord-api-types';
import { graphql } from 'relay-runtime';

import type { GuildLevelsQueryResponse } from '../../__generated__/GuildLevelsQuery.graphql';
import type { CorrectSnowflakeTypes, DeepMutable } from '../../utils/utils';

export type DiscordGuild = CorrectSnowflakeTypes<
  DeepMutable<Exclude<GuildLevelsQueryResponse['getDiscordGuild'], null>>
>;
export type Levels = CorrectSnowflakeTypes<DeepMutable<Exclude<GuildLevelsQueryResponse['getGuildLevels'], null>>>;

export type GuildLevelsUserInfo = Omit<Levels['levels'][0], 'userID'> & { userID: Snowflake };

export interface GuildLevelsRoleInfo {
  id: Snowflake;
  name: string;
  color: number;
}

export default graphql`
  query GuildLevelsQuery($id: String!) {
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
