import { gql } from '@apollo/client';

import type { DatabaseGuild } from '../../contexts/GuildContext';
import type { Guild as BaseGuild, Role } from './General';

export interface Autorole {
  getDiscordGuild: (BaseGuild & { roles: Role[] }) | null;
  getDatabaseGuild: Pick<DatabaseGuild, 'autoRole' | 'autoRoleTimeout'> | null;
}

export default gql`
  query getDiscordGuild($id: String!) {
    getDiscordGuild(id: $id, includeChannels: true) {
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
      autoRole
      autoRoleTimeout
    }
  }
`;
