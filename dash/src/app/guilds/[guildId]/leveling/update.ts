"use server";

import {
	array,
	boolean,
	check,
	enum_,
	forward,
	integer,
	literal,
	maxLength,
	maxValue,
	minLength,
	minValue,
	number,
	object,
	optional,
	parseJson,
	pipe,
	rawCheck,
	regex,
	string,
	transform,
	union,
} from "valibot";
import { saveSettings } from "@/app/guilds/[guildId]/settings.ts";
import {
	limitFor,
	MAX_XP_ANNOUNCE_LEVEL,
	MAX_XP_ANNOUNCE_LEVELS,
	MAX_XP_ANNOUNCE_MINIMUM_LEVEL,
	MAX_XP_ANNOUNCE_MULTIPLE_OF,
	MAX_XP_DISALLOWED_PREFIX_LENGTH,
	MAX_XP_GAIN_INTERVAL,
	MAX_XP_MESSAGE_LENGTH,
	MAX_XP_PER_MESSAGE,
	MAX_XP_ROLE_REWARD_LEVEL,
	MIN_XP_ANNOUNCE_LEVEL,
	MIN_XP_ANNOUNCE_MINIMUM_LEVEL,
	MIN_XP_ANNOUNCE_MULTIPLE_OF,
	MIN_XP_GAIN_INTERVAL,
	MIN_XP_MESSAGE_LENGTH,
	MIN_XP_PER_MESSAGE,
	MIN_XP_ROLE_REWARD_LEVEL,
} from "@/lib/guild-config.ts";
import {
	AutoResetLevels,
	LeaderboardVisibility,
	type SaveResult,
	XpAnnouncementChannelType,
	XpChannelMode,
} from "@/lib/guild.ts";
import { xpCurveError } from "@/lib/xp-curve.ts";
import { embedSchema } from "@/utils/embed-schema.ts";
import {
	coerceToInt,
	emptyStringToNull,
	requiredSnowflake,
	snowflake,
	snowflakeList,
	toggle,
	vanitySchema,
} from "@/utils/schemas.ts";

const xpPerMessage = pipe(coerceToInt, minValue(MIN_XP_PER_MESSAGE), maxValue(MAX_XP_PER_MESSAGE));

function schema(premium: boolean) {
	return pipe(
		object({
			accentColour: optional(pipe(string(), regex(/^#[\da-f]{6}$/i))),
			autoResetLevelsBan: toggle,
			autoResetLevelsLeave: toggle,
			leaderboardVisibility: enum_(LeaderboardVisibility),
			levels: toggle,
			noRoleRewardRoles: snowflakeList(limitFor("noRoleRewardRoles", premium)),
			noTopXpRoles: snowflakeList(limitFor("noTopXpRoles", premium)),
			noXpRoles: snowflakeList(limitFor("noXpRoles", premium)),
			syncRoleRewardsOnJoin: toggle,
			topXpRole: snowflake,
			vanity: union([emptyStringToNull, vanitySchema]),
			xpAnnounceChannel: snowflake,
			xpAnnounceChannelType: enum_(XpAnnouncementChannelType),
			xpAnnounceLevels: pipe(
				string(),
				parseJson(),
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
			xpChannels: snowflakeList(limitFor("xpChannels", premium)),
			xpCurve: pipe(
				string(),
				parseJson(),
				array(number()),
				rawCheck(({ addIssue, dataset }) => {
					const error = dataset.typed ? xpCurveError(dataset.value) : null;
					if (error) {
						addIssue({ message: error });
					}
				}),
			),
			xpDisallowedPrefixes: pipe(
				string(),
				parseJson(),
				array(pipe(string(), maxLength(MAX_XP_DISALLOWED_PREFIX_LENGTH))),
				maxLength(limitFor("xpDisallowedPrefixes", premium)),
			),
			xpFromCommands: toggle,
			xpGainInterval: pipe(coerceToInt, minValue(MIN_XP_GAIN_INTERVAL), maxValue(MAX_XP_GAIN_INTERVAL)),
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
				pipe(string(), parseJson(), embedSchema),
			]),
			xpPerMessageMax: xpPerMessage,
			xpPerMessageMin: xpPerMessage,
			xpRoleRewards: pipe(
				string(),
				parseJson(),
				array(
					object({
						id: string(),
						level: pipe(number(), integer(), minValue(MIN_XP_ROLE_REWARD_LEVEL), maxValue(MAX_XP_ROLE_REWARD_LEVEL)),
						roleIds: pipe(array(requiredSnowflake), maxLength(limitFor("xpRoleRewardRoles", premium))),
						stack: boolean(),
					}),
				),
				maxLength(limitFor("xpRoleRewards", premium)),
			),
		}),
		forward(
			check(
				({ xpAnnounceChannel, xpAnnounceChannelType }) =>
					xpAnnounceChannelType !== XpAnnouncementChannelType.Custom || xpAnnounceChannel !== null,
				"Missing Level Up Message Announcement channel",
			),
			["xpAnnounceChannel"],
		),
		forward(
			check(
				({ xpPerMessageMax, xpPerMessageMin }) => xpPerMessageMin <= xpPerMessageMax,
				"Minimum XP per message must be less than or equal to maximum XP per message",
			),
			["xpPerMessageMin"],
		),
		transform(({ autoResetLevelsBan, autoResetLevelsLeave, ...settings }) => ({
			...settings,
			autoResetLevels: autoResetLevels(autoResetLevelsLeave, autoResetLevelsBan),
		})),
	);
}

function autoResetLevels(leave: boolean | undefined, ban: boolean | undefined) {
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

export async function update(
	guildId: string,
	premium: boolean,
	_previousState: SaveResult | null,
	form: FormData,
): Promise<SaveResult> {
	return saveSettings(guildId, schema(premium), form);
}
