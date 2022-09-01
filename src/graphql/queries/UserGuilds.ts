import { graphql } from "relay-runtime";

export default graphql`
	query UserGuildsQuery($withPermissions: Boolean!) {
		getUserGuilds(withPermissions: $withPermissions) {
			icon
			id
			name
		}
	}
`;
