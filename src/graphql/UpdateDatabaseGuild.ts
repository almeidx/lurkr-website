import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/v8';

interface DatabaseGuild {
  _id: Snowflake;
}

export interface UpdateDatabaseGuild {
  updateDatabase: DatabaseGuild;
}

export default gql`
  mutation updateDatabaseGuild($id: String!, $data: DatabaseGuildChanges!) {
    updateDatabase(id: $id, changes: $data) {
      _id
    }
  }
`;
