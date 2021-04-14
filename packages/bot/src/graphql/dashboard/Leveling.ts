import { gql } from '@apollo/client';

import type { DatabaseGuild } from '../../contexts/GuildContext';
import type { Guild, Role } from './General';

export interface Leveling {
  getDiscordGuild: (Guild & { roles: Role[] }) | null;
  getDatabaseGuild: Pick<
    DatabaseGuild,
    | 'levels'
    | 'noXpRoles'
    | 'topXpRole'
    | 'xpBlacklistedChannels'
    | 'xpMessage'
    | 'xpResponseType'
    | 'xpRoles'
    | 'xpWhitelistedChannels'
  > | null;
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
        position
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
