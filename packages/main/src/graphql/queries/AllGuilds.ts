import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types';

interface Guild {
  emojiCount: number;
  icon: string;
  id: Snowflake;
  invite: string;
  name: string;
  memberCount: number;
  presenceCount: number;
}

export interface AllGuilds {
  allOfficialGuilds: Guild[];
  allOtherGuilds: Omit<Guild, 'emojiCount'>[];
}

export default gql`
  query {
    allOfficialGuilds {
      emojiCount
      icon
      id
      invite
      name
      memberCount
      presenceCount
    }

    allOtherGuilds {
      icon
      id
      invite
      name
      memberCount
      presenceCount
    }
  }
`;
