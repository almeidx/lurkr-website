/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GuildLevelsQueryVariables = {
    id: string;
};
export type GuildLevelsQueryResponse = {
    readonly getDiscordGuild: {
        readonly id: string;
        readonly icon: string | null;
        readonly name: string;
    } | null;
    readonly getGuildLevels: {
        readonly levels: ReadonlyArray<{
            readonly avatar: string | null;
            readonly level: number;
            readonly tag: string | null;
            readonly userID: string;
            readonly xp: number;
        }>;
        readonly roles: ReadonlyArray<{
            readonly level: number;
            readonly roles: ReadonlyArray<{
                readonly id: string;
                readonly name: string;
                readonly color: number;
            }>;
        }> | null;
    } | null;
};
export type GuildLevelsQuery = {
    readonly response: GuildLevelsQueryResponse;
    readonly variables: GuildLevelsQueryVariables;
};



/*
query GuildLevelsQuery(
  $id: String!
) {
  getDiscordGuild(id: $id, requireAuth: false) {
    id
    icon
    name
  }
  getGuildLevels(id: $id, requireAuth: false) {
    levels {
      avatar
      level
      tag
      userID
      xp
    }
    roles {
      level
      roles {
        id
        name
        color
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  },
  {
    "kind": "Literal",
    "name": "requireAuth",
    "value": false
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "level",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": (v1/*: any*/),
    "concreteType": "Guild",
    "kind": "LinkedField",
    "name": "getDiscordGuild",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "icon",
        "storageKey": null
      },
      (v3/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": (v1/*: any*/),
    "concreteType": "Levels",
    "kind": "LinkedField",
    "name": "getGuildLevels",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Level",
        "kind": "LinkedField",
        "name": "levels",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "avatar",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tag",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "userID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "xp",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "LevelRoles",
        "kind": "LinkedField",
        "name": "roles",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Role",
            "kind": "LinkedField",
            "name": "roles",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "color",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "GuildLevelsQuery",
    "selections": (v5/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GuildLevelsQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "e927182add104da0225d8eabe014d265",
    "id": null,
    "metadata": {},
    "name": "GuildLevelsQuery",
    "operationKind": "query",
    "text": "query GuildLevelsQuery(\n  $id: String!\n) {\n  getDiscordGuild(id: $id, requireAuth: false) {\n    id\n    icon\n    name\n  }\n  getGuildLevels(id: $id, requireAuth: false) {\n    levels {\n      avatar\n      level\n      tag\n      userID\n      xp\n    }\n    roles {\n      level\n      roles {\n        id\n        name\n        color\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '7bd5f5de5d23b1f5e13507ae0822e8e5';
export default node;
