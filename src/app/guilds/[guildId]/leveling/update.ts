"use server";

import { action } from "@/app/guilds/[guildId]/action-base.ts";
import {
	MAX_NO_ROLE_REWARD_ROLES,
	MAX_NO_ROLE_REWARD_ROLES_PREMIUM,
	MAX_NO_TOP_XP_ROLES,
	MAX_NO_TOP_XP_ROLES_PREMIUM,
	MAX_NO_XP_ROLES,
	MAX_NO_XP_ROLES_PREMIUM,
	MAX_XP_CHANNELS,
	MAX_XP_CHANNELS_PREMIUM,
	MAX_XP_DISALLOWED_PREFIXES,
	MAX_XP_DISALLOWED_PREFIXES_PREMIUM,
	MAX_XP_DISALLOWED_PREFIX_LENGTH,
	MAX_XP_MESSAGE_LENGTH,
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MAX_XP_ROLE_REWARD_ROLES,
	MAX_XP_ROLE_REWARD_ROLES_PREMIUM,
	MIN_XP_MESSAGE_LENGTH,
} from "@/lib/guild-config.ts";
import { GuildAccentType, type GuildSettings, XpAnnouncementChannelType, XpChannelMode } from "@/lib/guild.ts";
import {
	EMBED_AUTHOR_NAME_MAX_LENGTH,
	EMBED_DESCRIPTION_MAX_LENGTH,
	EMBED_FIELD_NAME_MAX_LENGTH,
	EMBED_FIELD_VALUE_MAX_LENGTH,
	EMBED_FOOTER_TEXT_MAX_LENGTH,
	EMBED_TITLE_MAX_LENGTH,
	EMBED_URL_MAX_LENGTH,
} from "@/utils/embed-limits.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import {
	UUID_REGEX,
	booleanFlag,
	createSnowflakesValidator,
	emptyStringToNull,
	snowflake,
	toggle,
	vanitySchema,
} from "@/utils/schemas.ts";
import {
	array,
	boolean,
	enum_,
	integer,
	literal,
	maxLength,
	maxValue,
	minLength,
	minValue,
	number,
	object,
	optional,
	parse,
	pipe,
	regex,
	string,
	transform,
	union,
} from "valibot";

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

// `role-rewards-${number}-${UUID}`
const xpRoleRewardsKeySchema = pipe(
	string(),
	regex(new RegExp(`^xpRoleRewards-\\d+-${UUID_REGEX.source}$`)),
	transform((value) => {
		const parts = value.split("-");
		return { level: Number(parts[1]), id: parts.slice(2).join("-") };
	}),
);
const regularXpRoleRewardRolesSchema = lazy(() => createSnowflakesValidator(MAX_XP_ROLE_REWARD_ROLES));
const premiumXpRoleRewardRolesSchema = lazy(() => createSnowflakesValidator(MAX_XP_ROLE_REWARD_ROLES_PREMIUM));

export async function update(guildId: string, premium: boolean, data: FormData) {
	const rawData = formDataToObject(data);
	const schema = premium ? premiumSchema() : regularSchema();

	const xpRoleRewardRolesSchema = premium ? premiumXpRoleRewardRolesSchema() : regularXpRoleRewardRolesSchema();

	const parsed = parse(schema, rawData);

	const settings = {
		...parsed,
		xpRoleRewards: Object.entries(rawData)
			.filter(([key]) => key.startsWith("xpRoleRewards-"))
			.map(([key, value]) => ({
				...parse(xpRoleRewardsKeySchema, key),
				roleIds: parse(xpRoleRewardRolesSchema, value),
			})),
	} satisfies Partial<GuildSettings>;

	if (settings.accentType === GuildAccentType.Custom && !settings.accentColour) {
		throw new Error("Missing accent colour");
	}

	if (settings.xpAnnounceChannelType === XpAnnouncementChannelType.Custom && !settings.xpAnnounceChannel) {
		throw new Error("Missing XP announce channel");
	}

	const maxXpRoleRewards = premium ? MAX_XP_ROLE_REWARDS_PREMIUM : MAX_XP_ROLE_REWARDS;
	if (settings.xpRoleRewards.length > maxXpRoleRewards) {
		throw new Error(`Too many XP role rewards (max ${maxXpRoleRewards})`);
	}

	await action(guildId, settings, `settings:${guildId}:leveling`);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
			accentColour: optional(pipe(string(), regex(/^#[\da-f]{6}$/i))),
			accentType: union([emptyStringToNull, pipe(string(), enum_(GuildAccentType))]),
			levels: toggle,
			noRoleRewardRoles: createSnowflakesValidator(
				premium ? MAX_NO_ROLE_REWARD_ROLES_PREMIUM : MAX_NO_ROLE_REWARD_ROLES,
			),
			noTopXpRoles: createSnowflakesValidator(premium ? MAX_NO_TOP_XP_ROLES_PREMIUM : MAX_NO_TOP_XP_ROLES),
			noXpRoles: createSnowflakesValidator(premium ? MAX_NO_XP_ROLES_PREMIUM : MAX_NO_XP_ROLES),
			stackXpRoles: booleanFlag,
			topXpRole: snowflake,
			vanity: union([emptyStringToNull, vanitySchema]),
			xpAnnounceChannel: snowflake,
			xpAnnounceChannelType: enum_(XpAnnouncementChannelType),
			xpChannelMode: enum_(XpChannelMode),
			xpChannels: createSnowflakesValidator(premium ? MAX_XP_CHANNELS_PREMIUM : MAX_XP_CHANNELS),
			xpDisallowedPrefixes: pipe(
				string(),
				transform((value) => JSON.parse(value)),
				array(pipe(string(), maxLength(MAX_XP_DISALLOWED_PREFIX_LENGTH))),
				maxLength(premium ? MAX_XP_DISALLOWED_PREFIXES_PREMIUM : MAX_XP_DISALLOWED_PREFIXES),
			),
			xpInThreads: toggle,
			xpMessage: union([
				emptyStringToNull,
				pipe(string(), minLength(MIN_XP_MESSAGE_LENGTH), maxLength(MAX_XP_MESSAGE_LENGTH)),
			]),
			xpMessageEmbed: union([
				pipe(
					literal("{}"),
					transform(() => null),
				),
				pipe(
					string(),
					transform((value) => JSON.parse(value)),
					object({
						author: optional(
							object({
								icon_url: optional(pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH))),
								name: pipe(string(), minLength(1), maxLength(EMBED_AUTHOR_NAME_MAX_LENGTH)),
								url: optional(pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH))),
							}),
						),
						title: optional(pipe(string(), maxLength(EMBED_TITLE_MAX_LENGTH))),
						description: optional(pipe(string(), maxLength(EMBED_DESCRIPTION_MAX_LENGTH))),
						fields: optional(
							pipe(
								array(
									object({
										name: pipe(string(), minLength(1), maxLength(EMBED_FIELD_NAME_MAX_LENGTH)),
										value: pipe(string(), minLength(1), maxLength(EMBED_FIELD_VALUE_MAX_LENGTH)),
										inline: optional(boolean()),
									}),
								),
								maxLength(25),
							),
						),
						footer: optional(
							object({
								text: pipe(string(), minLength(1), maxLength(EMBED_FOOTER_TEXT_MAX_LENGTH)),
								icon_url: optional(pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH))),
							}),
						),
						color: optional(pipe(number(), integer(), minValue(0), maxValue(0xffffff))),
						thumbnail: optional(object({ url: pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH)) })),
						image: optional(object({ url: pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH)) })),
						url: optional(pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH))),
					}),
				),
			]),
		}),
	);
}
