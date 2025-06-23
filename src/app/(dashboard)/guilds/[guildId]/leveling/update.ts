"use server";

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
	safeParse,
	string,
	transform,
	union,
} from "valibot";
import { action } from "@/app/(dashboard)/guilds/[guildId]/action-base.ts";
import {
	AutoResetLevels,
	GuildAccentType,
	type GuildSettings,
	LeaderboardVisibility,
	XpAnnouncementChannelType,
	XpChannelMode,
} from "@/lib/guild.ts";
import {
	MAX_NO_ROLE_REWARD_ROLES,
	MAX_NO_ROLE_REWARD_ROLES_PREMIUM,
	MAX_NO_TOP_XP_ROLES,
	MAX_NO_TOP_XP_ROLES_PREMIUM,
	MAX_NO_XP_ROLES,
	MAX_NO_XP_ROLES_PREMIUM,
	MAX_XP_ANNOUNCE_LEVEL,
	MAX_XP_ANNOUNCE_LEVELS,
	MAX_XP_ANNOUNCE_MINIMUM_LEVEL,
	MAX_XP_ANNOUNCE_MULTIPLE_OF,
	MAX_XP_CHANNELS,
	MAX_XP_CHANNELS_PREMIUM,
	MAX_XP_DISALLOWED_PREFIX_LENGTH,
	MAX_XP_DISALLOWED_PREFIXES,
	MAX_XP_DISALLOWED_PREFIXES_PREMIUM,
	MAX_XP_MESSAGE_LENGTH,
	MAX_XP_ROLE_REWARD_ROLES,
	MAX_XP_ROLE_REWARD_ROLES_PREMIUM,
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MIN_XP_ANNOUNCE_LEVEL,
	MIN_XP_ANNOUNCE_MINIMUM_LEVEL,
	MIN_XP_ANNOUNCE_MULTIPLE_OF,
	MIN_XP_MESSAGE_LENGTH,
} from "@/lib/guild-config.ts";
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
	coerceToInt,
	createSnowflakesValidator,
	emptyStringToNull,
	snowflake,
	toggle,
	UUID_REGEX,
	vanitySchema,
} from "@/utils/schemas.ts";
import { ServerActionError } from "@/utils/server-action-error.ts";

// TODO: Use `safeParse` instead of `parse`

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

// `role-rewards-${number}-${UUID}`
const xpRoleRewardsKeySchema = pipe(
	string(),
	regex(new RegExp(`^xpRoleRewards-\\d+-${UUID_REGEX.source}$`)),
	transform((value) => {
		const parts = value.split("-");
		return { id: parts.slice(2).join("-"), level: Number(parts[1]) };
	}),
);
const regularXpRoleRewardRolesSchema = lazy(() => createSnowflakesValidator(MAX_XP_ROLE_REWARD_ROLES));
const premiumXpRoleRewardRolesSchema = lazy(() => createSnowflakesValidator(MAX_XP_ROLE_REWARD_ROLES_PREMIUM));

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const rawData = formDataToObject(data);
	const schema = premium ? premiumSchema() : regularSchema();

	const xpRoleRewardRolesSchema = premium ? premiumXpRoleRewardRolesSchema() : regularXpRoleRewardRolesSchema();

	const result = safeParse(schema, rawData);

	if (!result.success) {
		return { error: ServerActionError.SchemaMismatch, issues: JSON.stringify(result.issues) };
	}

	const { autoResetLevelsBan, autoResetLevelsLeave, ...parsed } = result.output;

	const settings = {
		...parsed,
		autoResetLevels: transformAutoResetLevels(autoResetLevelsLeave, autoResetLevelsBan),
		xpRoleRewards: Object.entries(rawData)
			.filter(([key]) => key.startsWith("xpRoleRewards-") && !key.endsWith("-stack"))
			.map(([key, value]) => ({
				...parse(xpRoleRewardsKeySchema, key),
				roleIds: parse(xpRoleRewardRolesSchema, value),
				stack: rawData[`${key}-stack`] === "on",
			})),
	} satisfies Partial<GuildSettings>;

	if (settings.accentType === GuildAccentType.Custom && !settings.accentColour) {
		return { error: ServerActionError.ManualValidationFail, issue: "Missing accent colour" };
	}

	if (settings.xpAnnounceChannelType === XpAnnouncementChannelType.Custom && !settings.xpAnnounceChannel) {
		return { error: ServerActionError.ManualValidationFail, issue: "Missing Level Up Message Announcement channel" };
	}

	const maxXpRoleRewards = premium ? MAX_XP_ROLE_REWARDS_PREMIUM : MAX_XP_ROLE_REWARDS;
	if (settings.xpRoleRewards.length > maxXpRoleRewards) {
		return {
			error: ServerActionError.ManualValidationFail,
			issue: `Too many XP role rewards (max ${maxXpRoleRewards})`,
		};
	}

	return action(guildId, settings, `settings:${guildId}:leveling`, premium);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
			accentColour: optional(pipe(string(), regex(/^#[\da-f]{6}$/i))),
			accentType: union([emptyStringToNull, pipe(string(), enum_(GuildAccentType))]),
			autoResetLevelsBan: toggle,
			autoResetLevelsLeave: toggle,
			leaderboardVisibility: enum_(LeaderboardVisibility),
			levels: toggle,
			noRoleRewardRoles: createSnowflakesValidator(
				premium ? MAX_NO_ROLE_REWARD_ROLES_PREMIUM : MAX_NO_ROLE_REWARD_ROLES,
			),
			noTopXpRoles: createSnowflakesValidator(premium ? MAX_NO_TOP_XP_ROLES_PREMIUM : MAX_NO_TOP_XP_ROLES),
			noXpRoles: createSnowflakesValidator(premium ? MAX_NO_XP_ROLES_PREMIUM : MAX_NO_XP_ROLES),
			topXpRole: snowflake,
			vanity: union([emptyStringToNull, vanitySchema]),
			xpAnnounceChannel: snowflake,
			xpAnnounceChannelType: enum_(XpAnnouncementChannelType),
			xpAnnounceLevels: pipe(
				string(),
				transform((value) => JSON.parse(value)),
				array(pipe(coerceToInt, minValue(MIN_XP_ANNOUNCE_LEVEL), maxValue(MAX_XP_ANNOUNCE_LEVEL))),
				maxLength(MAX_XP_ANNOUNCE_LEVELS),
			),
			xpAnnounceMinimumLevel: union([
				pipe(
					literal(""),
					transform(() => 0),
				),
				pipe(coerceToInt, minValue(MIN_XP_ANNOUNCE_MINIMUM_LEVEL), maxValue(MAX_XP_ANNOUNCE_MINIMUM_LEVEL)),
			]),
			xpAnnounceMultipleOf: union([
				emptyStringToNull,
				pipe(coerceToInt, minValue(MIN_XP_ANNOUNCE_MULTIPLE_OF), maxValue(MAX_XP_ANNOUNCE_MULTIPLE_OF)),
			]),
			xpAnnounceOnlyXpRoles: toggle,
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
						color: optional(pipe(number(), integer(), minValue(0), maxValue(0xffffff))),
						description: optional(pipe(string(), maxLength(EMBED_DESCRIPTION_MAX_LENGTH))),
						fields: optional(
							pipe(
								array(
									object({
										inline: optional(boolean()),
										name: pipe(string(), minLength(1), maxLength(EMBED_FIELD_NAME_MAX_LENGTH)),
										value: pipe(string(), minLength(1), maxLength(EMBED_FIELD_VALUE_MAX_LENGTH)),
									}),
								),
								maxLength(25),
							),
						),
						footer: optional(
							object({
								icon_url: optional(pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH))),
								text: pipe(string(), minLength(1), maxLength(EMBED_FOOTER_TEXT_MAX_LENGTH)),
							}),
						),
						image: optional(object({ url: pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH)) })),
						thumbnail: optional(object({ url: pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH)) })),
						title: optional(pipe(string(), maxLength(EMBED_TITLE_MAX_LENGTH))),
						url: optional(pipe(string(), minLength(10), maxLength(EMBED_URL_MAX_LENGTH))),
					}),
				),
			]),
		}),
	);
}

function transformAutoResetLevels(leave: boolean | undefined, ban: boolean | undefined) {
	if (leave && ban) {
		return AutoResetLevels.BanAndLeave;
	}

	if (leave) {
		return AutoResetLevels.Leave;
	}

	if (ban) {
		return AutoResetLevels.Ban;
	}

	return AutoResetLevels.None;
}
