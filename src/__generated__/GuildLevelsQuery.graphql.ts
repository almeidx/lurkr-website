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
        readonly roles: ReadonlyArray<{
            readonly color: number;
            readonly id: string;
            readonly name: string;
            readonly position: number;
        }>;
    } | null;
    readonly getDiscordGuildChannels: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
    }> | null;
    readonly getGuildLevels: {
        readonly levels: ReadonlyArray<{
            readonly avatar: string | null;
            readonly level: number;
            readonly tag: string | null;
            readonly userID: string;
            readonly xp: number;
        }>;
        readonly multipliers: ReadonlyArray<{
            readonly _id: string;
            readonly multiplier: number;
            readonly targets: ReadonlyArray<string> | null;
            readonly type: string;
        }> | null;
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
    roles {
      color
      id
      name
      position
    }
  }
  getDiscordGuildChannels(id: $id) {
    id
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
    multipliers {
      _id
      multiplier
      targets
      type
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
v1 = {
  "kind": "Variable",
  "name": "id",
  "variableName": "id"
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "Literal",
    "name": "requireAuth",
    "value": false
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "level",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": (v2/*: any*/),
    "concreteType": "Guild",
    "kind": "LinkedField",
    "name": "getDiscordGuild",
    "plural": false,
    "selections": [
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "icon",
        "storageKey": null
      },
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Role",
        "kind": "LinkedField",
        "name": "roles",
        "plural": true,
        "selections": [
          (v5/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "position",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      (v1/*: any*/)
    ],
    "concreteType": "Channel",
    "kind": "LinkedField",
    "name": "getDiscordGuildChannels",
    "plural": true,
    "selections": [
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": (v2/*: any*/),
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
          (v6/*: any*/),
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
        "concreteType": "DatabaseXpMultiplier",
        "kind": "LinkedField",
        "name": "multipliers",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "_id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "multiplier",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "targets",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
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
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Role",
            "kind": "LinkedField",
            "name": "roles",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
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
    "selections": (v7/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GuildLevelsQuery",
    "selections": (v7/*: any*/)
  },
  "params": {
    "cacheID": "e402da818c3e480e29e77602b645e747",
    "id": null,
    "metadata": {},
    "name": "GuildLevelsQuery",
    "operationKind": "query",
    "text": "query GuildLevelsQuery(\n  $id: String!\n) {\n  getDiscordGuild(id: $id, requireAuth: false) {\n    id\n    icon\n    name\n    roles {\n      color\n      id\n      name\n      position\n    }\n  }\n  getDiscordGuildChannels(id: $id) {\n    id\n    name\n  }\n  getGuildLevels(id: $id, requireAuth: false) {\n    levels {\n      avatar\n      level\n      tag\n      userID\n      xp\n    }\n    multipliers {\n      _id\n      multiplier\n      targets\n      type\n    }\n    roles {\n      level\n      roles {\n        id\n        name\n        color\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '39363fb656bfb9fa108a1c21ac78bbcb';
export default node;
