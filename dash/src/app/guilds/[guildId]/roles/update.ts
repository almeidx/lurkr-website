"use server";

import { array, maxLength, object, parseJson, picklist, pipe, string } from "valibot";
import { saveSettings } from "@/app/guilds/[guildId]/settings.ts";
import {
	limitFor,
	MAX_AUTO_ROLE_FLAG_ROLES,
	MAX_AUTO_ROLE_FLAGS,
	MAX_AUTO_ROLE_TIMEOUT,
	MAX_MENTION_COOLDOWN_ROLES,
	MIN_AUTO_ROLE_TIMEOUT,
	MIN_MENTION_COOLDOWN,
} from "@/lib/guild-config.ts";
import type { SaveResult } from "@/lib/guild.ts";
import { minuteInterval, requiredSnowflake, snowflakeList } from "@/utils/schemas.ts";
import { UserFlags } from "@/utils/user-flags.ts";

const userFlags = Object.values(UserFlags).filter((flag): flag is UserFlags => typeof flag === "number");

function schema(premium: boolean) {
	return object({
		autoRole: snowflakeList(limitFor("autoRole", premium)),
		autoRoleFlags: pipe(
			string(),
			parseJson(),
			array(
				object({
					flagId: picklist(userFlags),
					id: string(),
					roleIds: pipe(array(requiredSnowflake), maxLength(MAX_AUTO_ROLE_FLAG_ROLES)),
				}),
			),
			maxLength(MAX_AUTO_ROLE_FLAGS),
		),
		autoRoleTimeout: minuteInterval(MIN_AUTO_ROLE_TIMEOUT, MAX_AUTO_ROLE_TIMEOUT),
		mentionCooldown: minuteInterval(MIN_MENTION_COOLDOWN, limitFor("mentionCooldown", premium)),
		mentionCooldownRoles: snowflakeList(MAX_MENTION_COOLDOWN_ROLES),
	});
}

export async function update(guildId: string, premium: boolean, _previousState: SaveResult | null, form: FormData) {
	return saveSettings(guildId, schema(premium), form);
}
