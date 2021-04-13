import { gql } from '@apollo/client';

import type { DatabaseGuild } from '../../contexts/GuildContext';
import type { Guild } from './General';

export interface Misc {
  getDiscordGuild: Guild | null;
  getDatabaseGuild: Pick<DatabaseGuild, 'storeCounts' | 'storeMilestones'> | null;
}

export default gql`
  query getDiscordGuild($id: String!) {
    getDiscordGuild(id: $id, includeChannels: true) {
      icon
      id
      name
      channels {
        id
        name
      }
    }

    getDatabaseGuild(id: $id) {
      storeCounts
      storeMilestones
    }
  }
`;
