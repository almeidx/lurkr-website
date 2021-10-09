import type { Snowflake } from 'discord-api-types';
import { graphql } from 'react-relay';

import type { DashboardGuildQueryResponse } from '../../__generated__/DashboardGuildQuery.graphql';
import type { CorrectSnowflakeTypes, DeepMutable } from '../../utils/utils';

type DatabaseGuildWithoutMultipliers = Omit<
  Exclude<DashboardGuildQueryResponse['getDatabaseGuild'], null>,
  'xpMultipliers' | 'xpRoles'
>;

export interface Multiplier {
  _id: string;
  multiplier: number;
  targets: Snowflake[] | null;
  type: 'channel' | 'global' | 'role';
}

export type DashboardDatabaseGuild = CorrectSnowflakeTypes<
  DeepMutable<DatabaseGuildWithoutMultipliers & { xpMultipliers: Multiplier[]; xpRoles: Record<string, Snowflake[]> }>
>;
export type DashboardDiscordGuild = CorrectSnowflakeTypes<
  DeepMutable<Exclude<DashboardGuildQueryResponse['getDiscordGuild'], null>>
>;
export type DashboardChannels = CorrectSnowflakeTypes<
  DeepMutable<Exclude<DashboardGuildQueryResponse['getDiscordGuildChannels'], null>>
>;
export type DashboardRoles = CorrectSnowflakeTypes<DeepMutable<DashboardDiscordGuild['roles']>>;

export enum AutoResetLevels {
  NONE = 0,
  LEAVE = 1,
  BAN = 2,
  BOTH = 3,
}

export default graphql`
  query DashboardGuildQuery($id: String!) {
    getDiscordGuild(id: $id, requireAuth: true) {
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

    getDiscordGuildChannels(id: $id) {
      id
      name
    }

    getDatabaseGuild(id: $id) {
      autoPublishChannels
      autoResetLevels
      autoRole
      autoRoleTimeout
      blacklistedChannels
      emojiList
      emojiListChannel
      levels
      mentionCooldown
      mentionCooldownRoles
      milestonesChannel
      milestonesInterval
      milestonesMessage
      milestonesRoles
      noXpRoles
      prefix
      premium
      prioritiseMultiplierRoleHierarchy
      stackXpRoles
      storeCounts
      storeMilestones
      topXpRole
      vanity
      xpAnnounceLevels
      xpAnnounceMinimumLevel
      xpAnnounceMultipleOf
      xpAnnounceOnlyXpRoles
      xpBlacklistedChannels
      xpInThreads
      xpMessage
      xpMultipliers {
        _id
        multiplier
        targets
        type
      }
      xpResponseType
      xpRoles
      xpWhitelistedChannels
    }
  }
`;
