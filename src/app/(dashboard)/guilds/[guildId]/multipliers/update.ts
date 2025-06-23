"use server";

import { maxValue, minValue, object, parse, pipe, regex, safeParse, string, transform } from "valibot";
import { action } from "@/app/(dashboard)/guilds/[guildId]/action-base.ts";
import { type GuildSettings, XpMultiplierType } from "@/lib/guild.ts";
import {
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
	MAX_XP_MULTIPLIERS,
	MAX_XP_MULTIPLIERS_PREMIUM,
	MIN_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { lazy } from "@/utils/lazy.ts";
import { booleanFlag, coerceToFloat, createSnowflakesValidator, toggle, UUID_REGEX } from "@/utils/schemas.ts";
import { ServerActionError } from "@/utils/server-action-error.ts";

// TODO: Use `safeParse` instead of `parse`

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

	const parsed = safeParse(schema, rawData);

	if (!parsed.success) {
		return { error: ServerActionError.SchemaMismatch, issues: JSON.stringify(parsed.issues) };
	}

	const multiplierTargetsSchema = premium ? premiumMultiplierTargetsSchema() : regularMultiplierTargetsSchema();

	const settings = {
		...parsed.output,
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

	return action(guildId, settings, `settings:${guildId}:multipliers`, premium);
}
