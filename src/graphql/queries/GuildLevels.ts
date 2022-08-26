import { graphql } from 'relay-runtime';

import type { GuildLevelsQuery$data } from '../../__generated__/GuildLevelsQuery.graphql';
import type { Snowflake } from '../../utils/constants';
import type { CorrectSnowflakeTypes, DeepMutable } from '../../utils/utils';

export type DiscordGuild = CorrectSnowflakeTypes<DeepMutable<Exclude<GuildLevelsQuery$data['getDiscordGuild'], null>>>;
export type Levels = CorrectSnowflakeTypes<DeepMutable<Exclude<GuildLevelsQuery$data['getGuildLevels'], null>>>;

export type GuildLevelsUserInfo = Omit<Levels['levels'][0], 'userID'> & { userID: Snowflake };

export type Channel = CorrectSnowflakeTypes<
  DeepMutable<Exclude<GuildLevelsQuery$data['getDiscordGuildChannels'], null>[0]>
>;
export type Role = CorrectSnowflakeTypes<
  DeepMutable<Exclude<GuildLevelsQuery$data['getDiscordGuild'], null>['roles'][0]>
>;

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
      roles {
        color
        id
        name
        position
      }
    }

    getDiscordGuildChannels(id: $id) {
      id
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

      multipliers {
        _id
        multiplier
        targets
        type
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
