/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type DatabaseGuildChanges = {
    autoPublishChannels?: Array<string> | null;
    autoResetLevels?: number | null;
    autoRole?: Array<string> | null;
    autoRoleTimeout?: number | null;
    blacklistedChannels?: Array<string> | null;
    emojiList?: boolean | null;
    emojiListChannel?: string | null;
    levels?: boolean | null;
    mentionCooldown?: number | null;
    mentionCooldownRoles?: Array<string> | null;
    milestonesChannel?: string | null;
    milestonesInterval?: number | null;
    milestonesMessage?: string | null;
    milestonesRoles?: Array<string> | null;
    noXpRoles?: Array<string> | null;
    prefix?: string | null;
    prioritiseMultiplierRoleHierarchy?: boolean | null;
    stackXpRoles?: boolean | null;
    storeCounts?: boolean | null;
    storeMilestones?: boolean | null;
    topXpRole?: string | null;
    vanity?: string | null;
    xpAnnounceLevels?: Array<number> | null;
    xpAnnounceMinimumLevel?: number | null;
    xpAnnounceMultipleOf?: number | null;
    xpAnnounceOnlyXpRoles?: boolean | null;
    xpBlacklistedChannels?: Array<string> | null;
    xpDisallowedPrefixes?: Array<string> | null;
    xpInThreads?: boolean | null;
    xpMessage?: string | null;
    xpMultipliers?: Array<DatabaseXpMultiplierType> | null;
    xpResponseType?: string | null;
    xpRoles?: unknown | null;
    xpWhitelistedChannels?: Array<string> | null;
};
export type DatabaseXpMultiplierType = {
    multiplier: number;
    targets?: Array<string> | null;
    type: string;
};
export type updateDatabaseGuildMutationVariables = {
    id: string;
    data: DatabaseGuildChanges;
};
export type updateDatabaseGuildMutationResponse = {
    readonly updateDatabase: {
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
        readonly xpAnnounceLevels: ReadonlyArray<number> | null;
        readonly xpAnnounceMinimumLevel: number;
        readonly xpAnnounceMultipleOf: number | null;
        readonly xpAnnounceOnlyXpRoles: boolean;
        readonly xpBlacklistedChannels: ReadonlyArray<string> | null;
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
export type updateDatabaseGuildMutation = {
    readonly response: updateDatabaseGuildMutationResponse;
    readonly variables: updateDatabaseGuildMutationVariables;
};



/*
mutation updateDatabaseGuildMutation(
  $id: String!
  $data: DatabaseGuildChanges!
) {
  updateDatabase(id: $id, changes: $data) {
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
    xpAnnounceLevels
    xpAnnounceMinimumLevel
    xpAnnounceMultipleOf
    xpAnnounceOnlyXpRoles
    xpBlacklistedChannels
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
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "data"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "changes",
        "variableName": "data"
      },
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "DatabaseGuild",
    "kind": "LinkedField",
    "name": "updateDatabase",
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
        "name": "xpAnnounceLevels",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpAnnounceMinimumLevel",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpAnnounceMultipleOf",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "xpAnnounceOnlyXpRoles",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateDatabaseGuildMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateDatabaseGuildMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "467f81f40001849068eff54f7c22028c",
    "id": null,
    "metadata": {},
    "name": "updateDatabaseGuildMutation",
    "operationKind": "mutation",
    "text": "mutation updateDatabaseGuildMutation(\n  $id: String!\n  $data: DatabaseGuildChanges!\n) {\n  updateDatabase(id: $id, changes: $data) {\n    autoPublishChannels\n    autoResetLevels\n    autoRole\n    autoRoleTimeout\n    blacklistedChannels\n    emojiList\n    emojiListChannel\n    levels\n    mentionCooldown\n    mentionCooldownRoles\n    milestonesChannel\n    milestonesInterval\n    milestonesMessage\n    milestonesRoles\n    noXpRoles\n    prefix\n    premium\n    prioritiseMultiplierRoleHierarchy\n    stackXpRoles\n    storeCounts\n    storeMilestones\n    topXpRole\n    vanity\n    xpAnnounceLevels\n    xpAnnounceMinimumLevel\n    xpAnnounceMultipleOf\n    xpAnnounceOnlyXpRoles\n    xpBlacklistedChannels\n    xpMessage\n    xpMultipliers {\n      _id\n      multiplier\n      targets\n      type\n    }\n    xpResponseType\n    xpRoles\n    xpWhitelistedChannels\n  }\n}\n"
  }
};
})();
(node as any).hash = 'a4e85740fe58a088574a1757a39a944f';
export default node;
