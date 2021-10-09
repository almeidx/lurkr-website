import { graphql } from 'react-relay';

export default graphql`
  query UserGuildsQuery($withPermissions: Boolean!) {
    getUserGuilds(withPermissions: $withPermissions) {
      icon
      id
      name
    }
  }
`;
