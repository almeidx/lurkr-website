/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UserGuildsQueryVariables = {
    withPermissions: boolean;
};
export type UserGuildsQueryResponse = {
    readonly getUserGuilds: ReadonlyArray<{
        readonly icon: string | null;
        readonly id: string;
        readonly name: string;
    }> | null;
};
export type UserGuildsQuery = {
    readonly response: UserGuildsQueryResponse;
    readonly variables: UserGuildsQueryVariables;
};



/*
query UserGuildsQuery(
  $withPermissions: Boolean!
) {
  getUserGuilds(withPermissions: $withPermissions) {
    icon
    id
    name
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "withPermissions"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "withPermissions",
        "variableName": "withPermissions"
      }
    ],
    "concreteType": "DiscordPartialUserGuild",
    "kind": "LinkedField",
    "name": "getUserGuilds",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "icon",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UserGuildsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserGuildsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "38ab3056b3186f95f8ecb453919ae5c3",
    "id": null,
    "metadata": {},
    "name": "UserGuildsQuery",
    "operationKind": "query",
    "text": "query UserGuildsQuery(\n  $withPermissions: Boolean!\n) {\n  getUserGuilds(withPermissions: $withPermissions) {\n    icon\n    id\n    name\n  }\n}\n"
  }
};
})();
(node as any).hash = 'ef579441696d9e27e9a4ba24a002bbb1';
export default node;
