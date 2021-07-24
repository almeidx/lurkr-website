import { gql } from '@apollo/client';
import type { Snowflake } from 'discord-api-types/v8';

import type { DatabaseGuild as FullDatabaseGuild, Multiplier } from '../queries/DashboardGuild';

type DatabaseGuildWithoutXpMultipliersId = Omit<FullDatabaseGuild, 'xpMultipliers'> & {
  xpMultipliers: Omit<Multiplier, '_id'>[];
};

interface DatabaseGuild {
  _id: Snowflake;
}

export interface UpdateDatabaseGuild {
  updateDatabase: DatabaseGuild;
}

export interface UpdateDatabaseGuildVariables {
  id: Snowflake;
  data: Partial<DatabaseGuildWithoutXpMultipliersId>;
}

export default gql`
  mutation updateDatabaseGuild($id: String!, $data: DatabaseGuildChanges!) {
    updateDatabase(id: $id, changes: $data) {
      _id
    }
  }
`;
