import { graphql } from 'relay-runtime';

import type { DashboardGuildQuery$data } from '../../__generated__/DashboardGuildQuery.graphql';
import type { Snowflake } from '../../utils/constants';
import type { CorrectSnowflakeTypes, DeepMutable } from '../../utils/utils';

type DatabaseGuildWithoutMultipliers = Omit<
  Exclude<DashboardGuildQuery$data['getDatabaseGuild'], null>,
  'xpMultipliers'
>;

export interface Multiplier {
  _id: string;
  multiplier: number;
  targets: Snowflake[] | null;
  type: 'channel' | 'global' | 'role';
}

export type DashboardDatabaseGuild = CorrectSnowflakeTypes<
  DeepMutable<DatabaseGuildWithoutMultipliers & { xpMultipliers: Multiplier[] }>
>;
export type DashboardDiscordGuild = CorrectSnowflakeTypes<
  DeepMutable<Exclude<DashboardGuildQuery$data['getDiscordGuild'], null>>
>;
export type DashboardChannels = CorrectSnowflakeTypes<
  DeepMutable<Exclude<DashboardGuildQuery$data['getDiscordGuildChannels'], null>>
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
      premium
      prioritiseMultiplierRoleHierarchy
      stackXpRoles
      storeCounts
      storeMilestones
      topXpRole
      vanity
      xpBlacklistedChannels
      xpDisallowedPrefixes
      xpInThreads
      xpMessage
      xpMultipliers {
        _id
        multiplier
        targets
        type
      }
      xpResponseType
      xpRoleRewards {
        level
        roleIds
      }
      xpWhitelistedChannels
    }
  }
`;
