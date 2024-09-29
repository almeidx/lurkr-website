"use server";

import { action } from "@/app/guilds/[guildId]/action-base.ts";
import {
	MAX_AUTO_ROLES,
	MAX_AUTO_ROLES_PREMIUM,
	MAX_AUTO_ROLE_FLAGS_ROLES,
	MAX_AUTO_ROLE_TIMEOUT,
	MAX_MENTION_COOLDOWN,
	MAX_MENTION_COOLDOWN_PREMIUM,
	MAX_MENTION_COOLDOWN_ROLES,
	MIN_AUTO_ROLE_TIMEOUT,
	MIN_MENTION_COOLDOWN,
} from "@/lib/guild-config.ts";
import type { GuildSettings } from "@/lib/guild.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { UUID_REGEX, createMinuteIntervalValidator, createSnowflakesValidator } from "@/utils/schemas.ts";
import { UserFlags } from "@/utils/user-flags.ts";
import { object, parse, pipe, regex, string, transform } from "valibot";

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

const autoRoleFlagRolesSchema = createSnowflakesValidator(MAX_AUTO_ROLE_FLAGS_ROLES);

const userFlagNumbers = Object.values(UserFlags).filter((key) => !Number.isNaN(Number(key)));

// `autoRoleFlags-${UserFlags}-${UUID}`
const autoRoleFlagsKeySchema = pipe(
	string(),
	regex(new RegExp(`^autoRoleFlags-(${userFlagNumbers.join("|")})-${UUID_REGEX.source}$`)),
	transform((value) => {
		const parts = value.split("-");
		return { id: parts.slice(2).join("-"), flagId: Number(parts[1]) as UserFlags };
	}),
);

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const rawData = formDataToObject(data);
	const schema = premium ? premiumSchema() : regularSchema();

	const settings = {
		...parse(schema, rawData),
		autoRoleFlags: Object.entries(rawData)
			.filter(([key]) => key.startsWith("autoRoleFlags-"))
			.map(([key, value]) => ({
				...parse(autoRoleFlagsKeySchema, key),
				roleIds: parse(autoRoleFlagRolesSchema, value),
			})),
	} satisfies Partial<GuildSettings>;

	return action(guildId, settings, `settings:${guildId}:roles`);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
			autoRole: createSnowflakesValidator(premium ? MAX_AUTO_ROLES_PREMIUM : MAX_AUTO_ROLES),
			autoRoleTimeout: createMinuteIntervalValidator(MIN_AUTO_ROLE_TIMEOUT, MAX_AUTO_ROLE_TIMEOUT, "Auto role timeout"),
			mentionCooldown: createMinuteIntervalValidator(MIN_MENTION_COOLDOWN, premium ? MAX_MENTION_COOLDOWN_PREMIUM : MAX_MENTION_COOLDOWN, "Mention cooldown"),
			mentionCooldownRoles: createSnowflakesValidator(MAX_MENTION_COOLDOWN_ROLES),
		}),
	);
}
