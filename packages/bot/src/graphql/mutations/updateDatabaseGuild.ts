import type { Snowflake } from 'discord-api-types';
import { graphql } from 'relay-runtime';

import type { DatabaseGuildChanges } from '../../__generated__/updateDatabaseGuildMutation.graphql';

export type DatabaseChanges = Omit<DatabaseGuildChanges, 'xpRoles'> & { xpRoles: Record<string, Snowflake[]> };

export default graphql`
  mutation updateDatabaseGuildMutation($id: String!, $data: DatabaseGuildChanges!) {
    updateDatabase(id: $id, changes: $data) {
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
