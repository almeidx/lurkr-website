"use server";

import { action } from "@/app/guilds/[guildId]/action-base.ts";
import {
	MAX_XP_MULTIPLIERS,
	MAX_XP_MULTIPLIERS_PREMIUM,
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { type GuildSettings, XpMultiplierType } from "@/lib/guild.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { UUID_REGEX, booleanFlag, createSnowflakesValidator, toggle } from "@/utils/schemas.ts";
import { coerce, maxValue, minValue, number, object, parse, regex, string, transform } from "valibot";

const schema = object({
	prioritiseMultiplierRoleHierarchy: booleanFlag,
	voteBoostedXp: toggle,
});

const xpMultiplierType = Object.values(XpMultiplierType);

const multiplierValueSchema = coerce(
	number("Multiplier value must be a number", [
		minValue(0.01, "Multiplier value must be >= 0.01"),
		maxValue(MAX_XP_MULTIPLIER_VALUE, "Multiplier value must be <= 5"),
	]),
	// @ts-expect-error: Overly strict type
	Number.parseFloat,
);
const regularMultiplierTargetsSchema = lazy(() => createSnowflakesValidator(MAX_XP_MULTIPLIER_TARGETS));
const premiumMultiplierTargetsSchema = lazy(() => createSnowflakesValidator(MAX_XP_MULTIPLIER_TARGETS_PREMIUM));

// `xpMultipliers-${XpMultiplierType}-${UUID}`
// `xpMultipliers-${XpMultiplierType}-${number}-${UUID}`
const xpMultipliersKeySchema = transform(
	string("Keys must be strings", [
		regex(
			new RegExp(`^xpMultipliers-(${xpMultiplierType.join("|")})-([\\d.]+-)?${UUID_REGEX.source}$`),
			"Multiplier key doesn't match the expected format",
		),
	]),
	(value) => {
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
	},
);

export async function update(guildId: string, premium: boolean, data: FormData) {
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

	await action(guildId, settings, `settings:${guildId}:multipliers`);
}
