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
  roles: Role[];
}

export interface Multiplier {
  _id: string;
  multiplier: number;
  targets: Snowflake[] | null;
  type: 'channel' | 'global' | 'role';
}

export enum AutoResetLevels {
  NONE = 0,
  LEAVE = 1,
  BAN = 2,
  BOTH = 3,
}

export interface DatabaseGuild {
  autoPublishChannels: Snowflake[] | null;
  autoResetLevels: AutoResetLevels;
  autoRole: Snowflake[] | null;
  autoRoleTimeout: number | null;
  blacklistedChannels: Snowflake[] | null;
  emojiList: boolean;
  emojiListChannel: Snowflake | null;
  levels: boolean;
  mentionCooldown: number;
  mentionCooldownRoles: Snowflake[] | null;
  milestonesChannel: Snowflake | null;
  milestonesInterval: number;
  milestonesMessage: string | null;
  milestonesRoles: Snowflake[] | null;
  noXpRoles: Snowflake[] | null;
  prefix: string;
  prioritiseMultiplierRoleHierarchy: boolean;
  stackXpRoles: boolean;
  storeCounts: boolean;
  storeMilestones: boolean;
  topXpRole: Snowflake | null;
  xpBlacklistedChannels: Snowflake[] | null;
  xpMessage: string;
  xpMultipliers: Multiplier[];
  xpResponseType: 'dm' | 'channel' | Snowflake | null;
  xpRoles: Record<string, Snowflake[]>;
  xpWhitelistedChannels: Snowflake[] | null;
}

export interface DashboardGuild {
  getDiscordGuild: Guild | null;
  getDiscordGuildChannels: Channel[] | null;
  getDatabaseGuild: DatabaseGuild | null;
}

export interface DashboardGuildVariables {
  id: Snowflake;
}

export default gql`
  query getDiscordGuild($id: String!) {
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
      prioritiseMultiplierRoleHierarchy
      stackXpRoles
      storeCounts
      storeMilestones
      topXpRole
      xpBlacklistedChannels
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
