"use server";

import { object, parse, pipe, regex, safeParse, string, transform } from "valibot";
import { action } from "@/app/(dashboard)/guilds/[guildId]/action-base.ts";
import type { GuildSettings } from "@/lib/guild.ts";
import {
	MAX_AUTO_ROLE_FLAGS_ROLES,
	MAX_AUTO_ROLE_TIMEOUT,
	MAX_AUTO_ROLES,
	MAX_AUTO_ROLES_PREMIUM,
	MAX_MENTION_COOLDOWN,
	MAX_MENTION_COOLDOWN_PREMIUM,
	MAX_MENTION_COOLDOWN_ROLES,
	MIN_AUTO_ROLE_TIMEOUT,
	MIN_MENTION_COOLDOWN,
} from "@/lib/guild-config.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { createMinuteIntervalValidator, createSnowflakesValidator, UUID_REGEX } from "@/utils/schemas.ts";
import { ServerActionError } from "@/utils/server-action-error.ts";
import { UserFlags } from "@/utils/user-flags.ts";

// TODO: Use `safeParse` instead of `parse`

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
		return { flagId: Number(parts[1]) as UserFlags, id: parts.slice(2).join("-") };
	}),
);

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const rawData = formDataToObject(data);
	const schema = premium ? premiumSchema() : regularSchema();

	const parsed = safeParse(schema, rawData);

	if (!parsed.success) {
		return { error: ServerActionError.SchemaMismatch, issues: JSON.stringify(parsed.issues) };
	}

	const settings = {
		...parsed.output,
		autoRoleFlags: Object.entries(rawData)
			.filter(([key]) => key.startsWith("autoRoleFlags-"))
			.map(([key, value]) => ({
				...parse(autoRoleFlagsKeySchema, key),
				roleIds: parse(autoRoleFlagRolesSchema, value),
			})),
	} satisfies Partial<GuildSettings>;

	return action(guildId, settings, `settings:${guildId}:roles`, premium);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
			autoRole: createSnowflakesValidator(premium ? MAX_AUTO_ROLES_PREMIUM : MAX_AUTO_ROLES),
			autoRoleTimeout: createMinuteIntervalValidator(MIN_AUTO_ROLE_TIMEOUT, MAX_AUTO_ROLE_TIMEOUT, "Auto role timeout"),
			mentionCooldown: createMinuteIntervalValidator(
				MIN_MENTION_COOLDOWN,
				premium ? MAX_MENTION_COOLDOWN_PREMIUM : MAX_MENTION_COOLDOWN,
				"Mention cooldown",
			),
			mentionCooldownRoles: createSnowflakesValidator(MAX_MENTION_COOLDOWN_ROLES),
		}),
	);
}
