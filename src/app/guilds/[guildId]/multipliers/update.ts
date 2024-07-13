"use server";

import { action } from "@/app/guilds/[guildId]/action-base.ts";
import {
	MAX_XP_MULTIPLIERS,
	MAX_XP_MULTIPLIERS_PREMIUM,
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
	MIN_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { type GuildSettings, XpMultiplierType } from "@/lib/guild.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { UUID_REGEX, booleanFlag, coerceToFloat, createSnowflakesValidator, toggle } from "@/utils/schemas.ts";
import { maxValue, minValue, object, parse, pipe, regex, string, transform } from "valibot";

const schema = object({
	prioritiseMultiplierRoleHierarchy: booleanFlag,
	voteBoostedXp: toggle,
});

const xpMultiplierType = Object.values(XpMultiplierType);

const multiplierValueSchema = pipe(coerceToFloat, minValue(MIN_XP_MULTIPLIER_VALUE), maxValue(MAX_XP_MULTIPLIER_VALUE));

const regularMultiplierTargetsSchema = lazy(() => createSnowflakesValidator(MAX_XP_MULTIPLIER_TARGETS));
const premiumMultiplierTargetsSchema = lazy(() => createSnowflakesValidator(MAX_XP_MULTIPLIER_TARGETS_PREMIUM));

// `xpMultipliers-${XpMultiplierType}-${UUID}`
// `xpMultipliers-${XpMultiplierType}-${number}-${UUID}`
const xpMultipliersKeySchema = pipe(
	string("Keys must be strings"),
	regex(
		new RegExp(`^xpMultipliers-(${xpMultiplierType.join("|")})-([\\d.]+-)?${UUID_REGEX.source}$`),
		"Multiplier key doesn't match the expected format",
	),
	transform((value) => {
		const parts = value.split("-");
		const type = parts[1] as XpMultiplierType;

		switch (type) {
			case XpMultiplierType.Global:
				return { id: parts.slice(2).join("-"), multiplier: null, type };

			case XpMultiplierType.Channel:
			case XpMultiplierType.Role:
				return { id: parts.slice(3).join("-"), multiplier: parse(multiplierValueSchema, parts[2]), type };

			default:
				throw new Error(`Invalid multiplier type: ${type}`);
		}
	}),
);

export async function update(guildId: string, premium: boolean, _currentState: unknown, data: FormData) {
	const rawData = formDataToObject(data);

	const parsed = parse(schema, rawData);

	const multiplierTargetsSchema = premium ? premiumMultiplierTargetsSchema() : regularMultiplierTargetsSchema();

	const settings = {
		...parsed,
		xpMultipliers: Object.entries(rawData)
			.filter(([key]) => key.startsWith("xpMultipliers-"))
			.map(([key, value]) => {
				const keyData = parse(xpMultipliersKeySchema, key);
				const targets = keyData.type === XpMultiplierType.Global ? [] : parse(multiplierTargetsSchema, rawData[key]);
				const multiplier = keyData.multiplier ?? parse(multiplierValueSchema, value); // Global multipliers don't have the multiplier value in the key

				return { ...keyData, multiplier, targets };
			}),
	} satisfies Partial<GuildSettings>;

	const maxXpMultipliers = premium ? MAX_XP_MULTIPLIERS_PREMIUM : MAX_XP_MULTIPLIERS;

	if (settings.xpMultipliers.length > maxXpMultipliers) {
		throw new Error(`Maximum of ${maxXpMultipliers} XP multipliers exceeded`);
	}

	return action(guildId, settings, `settings:${guildId}:multipliers`);
}
