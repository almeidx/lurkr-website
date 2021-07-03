import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/v8';

import type { DatabaseGuild as FullDatabaseGuild } from '../queries/DashboardGuild';

interface DatabaseGuild {
  _id: Snowflake;
}

export interface UpdateDatabaseGuild {
  updateDatabase: DatabaseGuild;
}

export interface UpdateDatabaseGuildVariables {
  id: Snowflake;
  data: Partial<FullDatabaseGuild>;
}

export default gql`
  mutation updateDatabaseGuild($id: String!, $data: DatabaseGuildChanges!) {
    updateDatabase(id: $id, changes: $data) {
      _id
    }
  }
`;
