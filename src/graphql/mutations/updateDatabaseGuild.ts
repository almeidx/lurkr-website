import { graphql } from 'relay-runtime';

import type { DatabaseGuildChanges } from '../../__generated__/updateDatabaseGuildMutation.graphql';
import type { Snowflake } from '../../utils/constants';

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
      vanity
      xpBlacklistedChannels
      xpDisallowedPrefixes
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
