import { graphql } from "relay-runtime";
import type { DatabaseGuildChanges } from "../../__generated__/updateDatabaseGuildMutation.graphql";

export type DatabaseChanges = DatabaseGuildChanges;

export default graphql`
	mutation updateDatabaseGuildMutation($id: String!, $data: DatabaseGuildChanges!) {
		updateDatabase(id: $id, changes: $data) {
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
			xpMessage
			xpMultipliers {
				id
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
