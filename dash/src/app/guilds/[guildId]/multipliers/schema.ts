import { array, enum as enum_, maxLength, maxValue, minValue, number, object, parseJson, pipe, string } from "valibot";
import { limitFor, MAX_XP_MULTIPLIER_VALUE, MIN_XP_MULTIPLIER_VALUE } from "@/lib/guild-config.ts";
import { XpMultiplierType } from "@/lib/guild.ts";
import { booleanFlag, coerceToFloat, requiredSnowflake, toggle } from "@/utils/schemas.ts";

export function schema(premium: boolean) {
	return object({
		prioritiseMultiplierRoleHierarchy: booleanFlag,
		voteBoostedXp: toggle,
		xpGlobalMultiplier: pipe(coerceToFloat, minValue(MIN_XP_MULTIPLIER_VALUE), maxValue(MAX_XP_MULTIPLIER_VALUE)),
		xpMultipliers: pipe(
			string(),
			parseJson(),
			array(
				object({
					id: string(),
					multiplier: pipe(number(), minValue(MIN_XP_MULTIPLIER_VALUE), maxValue(MAX_XP_MULTIPLIER_VALUE)),
					targets: pipe(array(requiredSnowflake), maxLength(limitFor("xpMultiplierTargets", premium))),
					type: enum_(XpMultiplierType),
				}),
			),
			maxLength(limitFor("xpMultipliers", premium)),
		),
	});
}
