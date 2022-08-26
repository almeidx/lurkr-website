/**
 * @generated SignedSource<<1324b31af7b2a2318f5ad69cb2a72e92>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DatabaseGuildChanges = {
  autoPublishChannels?: ReadonlyArray<string> | null;
  autoResetLevels?: number | null;
  autoRole?: ReadonlyArray<string> | null;
  autoRoleTimeout?: number | null;
  blacklistedChannels?: ReadonlyArray<string> | null;
  emojiList?: boolean | null;
  emojiListChannel?: string | null;
  levels?: boolean | null;
  mentionCooldown?: number | null;
  mentionCooldownRoles?: ReadonlyArray<string> | null;
  milestonesChannel?: string | null;
  milestonesInterval?: number | null;
  milestonesMessage?: string | null;
  milestonesRoles?: ReadonlyArray<string> | null;
  noXpRoles?: ReadonlyArray<string> | null;
  prefix?: string | null;
  prioritiseMultiplierRoleHierarchy?: boolean | null;
  stackXpRoles?: boolean | null;
  storeCounts?: boolean | null;
  storeMilestones?: boolean | null;
  topXpRole?: string | null;
  vanity?: string | null;
  xpAnnounceLevels?: ReadonlyArray<number> | null;
  xpAnnounceMinimumLevel?: number | null;
  xpAnnounceMultipleOf?: number | null;
  xpAnnounceOnlyXpRoles?: boolean | null;
  xpBlacklistedChannels?: ReadonlyArray<string> | null;
  xpDisallowedPrefixes?: ReadonlyArray<string> | null;
  xpInThreads?: boolean | null;
  xpMessage?: string | null;
  xpMultipliers?: ReadonlyArray<DatabaseXpMultiplierType> | null;
  xpResponseType?: string | null;
  xpRoleRewards?: ReadonlyArray<DatabaseXpRoleRewardType> | null;
  xpWhitelistedChannels?: ReadonlyArray<string> | null;
};
export type DatabaseXpMultiplierType = {
  multiplier: number;
  targets?: ReadonlyArray<string> | null;
  type: string;
};
export type DatabaseXpRoleRewardType = {
  level: number;
  roleIds: ReadonlyArray<string>;
};
export type updateDatabaseGuildMutation$variables = {
  id: string;
  data: DatabaseGuildChanges;
};
export type updateDatabaseGuildMutation$data = {
  readonly updateDatabase: {
    readonly autoPublishChannels: ReadonlyArray<string> | null;
    readonly autoResetLevels: number;
    readonly autoRole: ReadonlyArray<string> | null;
    readonly autoRoleTimeout: number | null;
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
    readonly premium: boolean;
    readonly prioritiseMultiplierRoleHierarchy: boolean;
    readonly stackXpRoles: boolean;
    readonly storeCounts: boolean;
    readonly storeMilestones: boolean;
    readonly topXpRole: string | null;
    readonly vanity: string | null;
    readonly xpBlacklistedChannels: ReadonlyArray<string> | null;
    readonly xpDisallowedPrefixes: ReadonlyArray<string>;
    readonly xpMessage: string;
    readonly xpMultipliers: ReadonlyArray<{
      readonly _id: string;
      readonly multiplier: number;
      readonly targets: ReadonlyArray<string> | null;
      readonly type: string;
    }>;
    readonly xpResponseType: string | null;
    readonly xpRoleRewards: ReadonlyArray<{
      readonly level: number;
      readonly roleIds: ReadonlyArray<string>;
    }>;
    readonly xpWhitelistedChannels: ReadonlyArray<string> | null;
  } | null;
};
export type updateDatabaseGuildMutation = {
  variables: updateDatabaseGuildMutation$variables;
  response: updateDatabaseGuildMutation$data;
};

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
        "name": "xpDisallowedPrefixes",
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
        "concreteType": "DatabaseXpRoleReward",
        "kind": "LinkedField",
        "name": "xpRoleRewards",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "level",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "roleIds",
            "storageKey": null
          }
        ],
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
    "cacheID": "fe194db482b255397961fbe06a56ec12",
    "id": null,
    "metadata": {},
    "name": "updateDatabaseGuildMutation",
    "operationKind": "mutation",
    "text": "mutation updateDatabaseGuildMutation(\n  $id: String!\n  $data: DatabaseGuildChanges!\n) {\n  updateDatabase(id: $id, changes: $data) {\n    autoPublishChannels\n    autoResetLevels\n    autoRole\n    autoRoleTimeout\n    emojiList\n    emojiListChannel\n    levels\n    mentionCooldown\n    mentionCooldownRoles\n    milestonesChannel\n    milestonesInterval\n    milestonesMessage\n    milestonesRoles\n    noXpRoles\n    premium\n    prioritiseMultiplierRoleHierarchy\n    stackXpRoles\n    storeCounts\n    storeMilestones\n    topXpRole\n    vanity\n    xpBlacklistedChannels\n    xpDisallowedPrefixes\n    xpMessage\n    xpMultipliers {\n      _id\n      multiplier\n      targets\n      type\n    }\n    xpResponseType\n    xpRoleRewards {\n      level\n      roleIds\n    }\n    xpWhitelistedChannels\n  }\n}\n"
  }
};
})();

(node as any).hash = "15a6f57b8db6e3b27f6fb037b6bfbaf2";

export default node;
