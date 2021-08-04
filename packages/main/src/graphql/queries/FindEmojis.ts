import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types';

interface Emoji {
  animated: boolean;
  id: Snowflake;
  invite: string;
  name: string;
}

export interface FindEmojis {
  findEmojis: Emoji[];
}

export default gql`
  query findEmojis($query: String!, $other: Boolean! = false) {
    findEmojis(query: $query, other: $other) {
      animated
      id
      invite
      name
    }
  }
`;
