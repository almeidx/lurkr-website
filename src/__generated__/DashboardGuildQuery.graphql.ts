/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type DashboardGuildQueryVariables = {
    id: string;
};
export type DashboardGuildQueryResponse = {
    readonly getDiscordGuild: {
        readonly icon: string | null;
        readonly id: string;
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
    readonly getDatabaseGuild: {
        readonly autoPublishChannels: ReadonlyArray<string> | null;
        readonly autoResetLevels: number;
        readonly autoRole: ReadonlyArray<string> | null;
        readonly autoRoleTimeout: number | null;
        readonly blacklistedChannels: ReadonlyArray<string> | null;
        readonly emojiList: boolean;
        readonly emojiListChannel: string | null;
        readonly levels: boolean;
        readonly mentionCooldown: number;
        readonly mentionCooldownRoles: ReadonlyArray<string> | null;
        readonly milestonesChannel: string | null;
        readonly milestonesInterval: number;
        readonly milestonesMessage: string | null;
        readonly milestonesRoles: ReadonlyArray<string> | null;
        readonly noXpRoles: ReadonlyArray<string> | null;
        readonly prefix: string;
        readonly premium: boolean;
        readonly prioritiseMultiplierRoleHierarchy: boolean;
        readonly stackXpRoles: boolean;
        readonly storeCounts: boolean;
        readonly storeMilestones: boolean;
        readonly topXpRole: string | null;
        readonly vanity: string | null;
        readonly xpBlacklistedChannels: ReadonlyArray<string> | null;
        readonly xpInThreads: boolean;
        readonly xpMessage: string;
        readonly xpMultipliers: ReadonlyArray<{
            readonly _id: string;
            readonly multiplier: number;
            readonly targets: ReadonlyArray<string> | null;
            readonly type: string;
        }>;
        readonly xpResponseType: string | null;
        readonly xpRoles: unknown;
        readonly xpWhitelistedChannels: ReadonlyArray<string> | null;
    } | null;
};
export type DashboardGuildQuery = {
    readonly response: DashboardGuildQueryResponse;
    readonly variables: DashboardGuildQueryVariables;
};



/*
query DashboardGuildQuery(
  $id: String!
) {
  getDiscordGuild(id: $id, requireAuth: true) {
    icon
    id
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
  getDatabaseGuild(id: $id) {
    autoPublishChannels
    autoResetLevels
    autoRole
    autoRoleTimeout
    blacklistedChannels
    emojiList
    emojiListChannel
    levels
    mentionCooldown
    mentionCooldownRoles
    milestonesChannel
    milestonesInterval
    milestonesMessage
    milestonesRoles
    noXpRoles
    prefix
    premium
    prioritiseMultiplierRoleHierarchy
    stackXpRoles
    storeCounts
    storeMilestones
    topXpRole
    vanity
    xpBlacklistedChannels
    xpInThreads
    xpMessage
    xpMultipliers {
      _id
      multiplier
      targets
      type
    }
    xpResponseType
    xpRoles
    xpWhitelistedChannels
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
v4 = [
  (v1/*: any*/)
],
v5 = [
  {
    "alias": null,
    "args": [
      (v1/*: any*/),
      {
        "kind": "Literal",
        "name": "requireAuth",
        "value": true
      }
    ],
    "concreteType": "Guild",
    "kind": "LinkedField",
    "name": "getDiscordGuild",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "icon",
        "storageKey": null
      },
      (v2/*: any*/),
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Role",
        "kind": "LinkedField",
        "name": "roles",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "color",
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
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
    "args": (v4/*: any*/),
    "concreteType": "Channel",
    "kind": "LinkedField",
    "name": "getDiscordGuildChannels",
    "plural": true,
    "selections": [
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": (v4/*: any*/),
    "concreteType": "DatabaseGuild",
    "kind": "LinkedField",
    "name": "getDatabaseGuild",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "autoPublishChannels",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "autoResetLevels",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "autoRole",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "autoRoleTimeout",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "blacklistedChannels",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "emojiList",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "emojiListChannel",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "levels",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "mentionCooldown",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "mentionCooldownRoles",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "milestonesChannel",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "milestonesInterval",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "milestonesMessage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "milestonesRoles",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "noXpRoles",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "prefix",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "premium",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "prioritiseMultiplierRoleHierarchy",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "stackXpRoles",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "storeCounts",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "storeMilestones",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "topXpRole",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "vanity",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpBlacklistedChannels",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpInThreads",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpMessage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "DatabaseXpMultiplier",
        "kind": "LinkedField",
        "name": "xpMultipliers",
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
        "kind": "ScalarField",
        "name": "xpResponseType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpRoles",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpWhitelistedChannels",
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
    "name": "DashboardGuildQuery",
    "selections": (v5/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DashboardGuildQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "98991ae8515e09ca1ade9ef2997fb040",
    "id": null,
    "metadata": {},
    "name": "DashboardGuildQuery",
    "operationKind": "query",
    "text": "query DashboardGuildQuery(\n  $id: String!\n) {\n  getDiscordGuild(id: $id, requireAuth: true) {\n    icon\n    id\n    name\n    roles {\n      color\n      id\n      name\n      position\n    }\n  }\n  getDiscordGuildChannels(id: $id) {\n    id\n    name\n  }\n  getDatabaseGuild(id: $id) {\n    autoPublishChannels\n    autoResetLevels\n    autoRole\n    autoRoleTimeout\n    blacklistedChannels\n    emojiList\n    emojiListChannel\n    levels\n    mentionCooldown\n    mentionCooldownRoles\n    milestonesChannel\n    milestonesInterval\n    milestonesMessage\n    milestonesRoles\n    noXpRoles\n    prefix\n    premium\n    prioritiseMultiplierRoleHierarchy\n    stackXpRoles\n    storeCounts\n    storeMilestones\n    topXpRole\n    vanity\n    xpBlacklistedChannels\n    xpInThreads\n    xpMessage\n    xpMultipliers {\n      _id\n      multiplier\n      targets\n      type\n    }\n    xpResponseType\n    xpRoles\n    xpWhitelistedChannels\n  }\n}\n"
  }
};
})();
(node as any).hash = '2ec54d5d2759823bc6d3fa20b8e76c52';
export default node;
