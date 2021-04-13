import type { Snowflake } from 'discord-api-types/v8';
import gql from 'graphql-tag';

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
  query findEmojis($query: String!) {
    findEmojis(query: $query) {
      animated
      id
      invite
      name
    }
  }
`;
