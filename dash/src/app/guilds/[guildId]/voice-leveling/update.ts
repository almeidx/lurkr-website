"use server";

import { enum_, maxValue, minValue, object, pipe, safeParse } from "valibot";
import { action } from "@/app/guilds/[guildId]/action-base.ts";
import { XpChannelMode } from "@/lib/guild.ts";
import {
	MAX_VOICE_XP_MAX_SESSION,
	MAX_VOICE_XP_MAX_SESSION_PREMIUM,
	MAX_VOICE_XP_MIN_GROUP_COUNT,
	MAX_VOICE_XP_MIN_GROUP_COUNT_PREMIUM,
	MAX_VOICE_XP_PER_MINUTE,
	MAX_VOICE_XP_SESSION_COOLDOWN,
	MAX_VOICE_XP_SESSION_COOLDOWN_PREMIUM,
	MAX_XP_CHANNELS,
	MAX_XP_CHANNELS_PREMIUM,
	MIN_VOICE_XP_MAX_SESSION,
	MIN_VOICE_XP_MIN_GROUP_COUNT,
	MIN_VOICE_XP_PER_MINUTE,
	MIN_VOICE_XP_SESSION_COOLDOWN,
} from "@/lib/guild-config.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { coerceToInt, createMinuteIntervalValidator, createSnowflakesValidator, toggle } from "@/utils/schemas.ts";
import { ServerActionError } from "@/utils/server-action-error.ts";

const regularSchema = createSchema(false);
const premiumSchema = createSchema(true);

export async function update(
	guildId: string,
	premium: boolean,
	levelingEnabled: boolean,
	_currentState: unknown,
	data: FormData,
) {
	const schema = premium ? premiumSchema() : regularSchema();

	const result = safeParse(schema, formDataToObject(data));

	if (!result.success) {
		return { error: ServerActionError.SchemaMismatch, issues: JSON.stringify(result.issues) };
	}

	// `levelingEnabled` is bound server-side at render time (not submitted form
	// data), mirroring the bot's rule that voice XP requires the leveling system.
	if (result.output.voiceXpEnabled && !levelingEnabled) {
		return {
			error: ServerActionError.ManualValidationFail,
			issue: "Voice XP requires the leveling system. Enable leveling on the Leveling page first.",
		};
	}

	if (result.output.voiceXpPerMinuteMin > result.output.voiceXpPerMinuteMax) {
		return {
			error: ServerActionError.ManualValidationFail,
			issue: "Minimum voice XP per minute must be less than or equal to maximum voice XP per minute",
		};
	}

	return action(guildId, result.output, `settings:${guildId}:voice-leveling`, premium);
}

function createSchema(premium: boolean) {
	return lazy(() =>
		object({
			voiceXpChannelMode: enum_(XpChannelMode),
			voiceXpChannels: createSnowflakesValidator(premium ? MAX_XP_CHANNELS_PREMIUM : MAX_XP_CHANNELS),
			voiceXpDisallowMuted: toggle,
			voiceXpEnabled: toggle,
			voiceXpMaxSession: createMinuteIntervalValidator(
				MIN_VOICE_XP_MAX_SESSION,
				premium ? MAX_VOICE_XP_MAX_SESSION_PREMIUM : MAX_VOICE_XP_MAX_SESSION,
				"Voice XP maximum session length",
			),
			voiceXpMaxSessionCooldown: createMinuteIntervalValidator(
				MIN_VOICE_XP_SESSION_COOLDOWN,
				premium ? MAX_VOICE_XP_SESSION_COOLDOWN_PREMIUM : MAX_VOICE_XP_SESSION_COOLDOWN,
				"Voice XP session cooldown",
			),
			voiceXpMinGroupCount: pipe(
				coerceToInt,
				minValue(MIN_VOICE_XP_MIN_GROUP_COUNT),
				maxValue(premium ? MAX_VOICE_XP_MIN_GROUP_COUNT_PREMIUM : MAX_VOICE_XP_MIN_GROUP_COUNT),
			),
			voiceXpPerMinuteMax: pipe(coerceToInt, minValue(MIN_VOICE_XP_PER_MINUTE), maxValue(MAX_VOICE_XP_PER_MINUTE)),
			voiceXpPerMinuteMin: pipe(coerceToInt, minValue(MIN_VOICE_XP_PER_MINUTE), maxValue(MAX_VOICE_XP_PER_MINUTE)),
		}),
	);
}
