import { gql } from '@apollo/client';

interface Guild {
  icon: string | null;
  id: string;
  name: string;
  permissions: string;
}

export interface UserGuilds {
  getUserGuilds: Guild[] | null;
}

export default gql`
  query {
    getUserGuilds {
      icon
      id
      name
      permissions
    }
  }
`;
