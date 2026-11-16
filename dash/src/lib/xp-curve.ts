import { MAX_XP_CURVE_COEFFICIENTS, MIN_XP_CURVE_COEFFICIENTS } from "@/lib/guild-config.ts";

/**
 * An XP curve is a polynomial in the level `n`, with `curve[i]` the coefficient of `n^i`.
 */
type XpCurve = readonly number[];

/** The total XP required to reach `level`. */
export function xpForLevel(curve: XpCurve, level: number): number {
	if (level <= 0) {
		return 0;
	}

	return Math.round(curve.reduce((sum, coefficient, exponent) => sum + coefficient * level ** exponent, 0));
}

function slopeAt(curve: XpCurve, level: number): number {
	return curve.reduce((sum, coefficient, exponent) => sum + exponent * coefficient * level ** (exponent - 1), 0);
}

const VALIDATION_LEVELS = [0, 1, 2, 5, 10, 25, 50, 100, 250, 500, 750, 1000];

/** Why the curve can't be used, or `null` if it can. */
export function xpCurveError(curve: XpCurve): string | null {
	if (curve.length < MIN_XP_CURVE_COEFFICIENTS || curve.length > MAX_XP_CURVE_COEFFICIENTS) {
		return `Number of coefficients must be between ${MIN_XP_CURVE_COEFFICIENTS} and ${MAX_XP_CURVE_COEFFICIENTS}`;
	}

	const nonFiniteIndex = curve.findIndex((coefficient) => !Number.isFinite(coefficient));
	if (nonFiniteIndex !== -1) {
		return `Coefficient at index ${nonFiniteIndex} is not a finite number.`;
	}

	if (curve.every((coefficient) => coefficient === 0)) {
		return "All coefficients cannot be zero. At least one non-zero coefficient is required.";
	}

	let previousXp = 0;
	let previousLevel = 0;

	for (const level of VALIDATION_LEVELS) {
		const xp = xpForLevel(curve, level);

		if (xp < 0) {
			return `XP cannot be negative. At level ${level}, XP would be ${xp}.`;
		}

		if (level > 0) {
			if (xp <= previousXp) {
				return `XP must strictly increase with each level. Level ${level} requires ${xp} XP, same as or less than level ${previousLevel} (${previousXp} XP).`;
			}

			if (slopeAt(curve, level) < 0) {
				return `The curve decreases at level ${level}. XP must increase with each level.`;
			}
		}

		previousXp = xp;
		previousLevel = level;
	}

	return null;
}

const POWERS = ["", "n", "n²", "n³", "n⁴"];

/** The curve as a formula, e.g. `50n² − 100n + 150`. Coefficients are rounded to two decimals, marked by `≈`. */
export function describeXpCurve(curve: XpCurve): string {
	let isRounded = false;
	let formula = "";

	for (let exponent = curve.length - 1; exponent >= 0; exponent--) {
		const coefficient = curve[exponent]!;
		if (coefficient === 0) continue;

		const magnitude = Math.round(Math.abs(coefficient) * 100) / 100;
		isRounded ||= magnitude !== Math.abs(coefficient);

		const sign = coefficient < 0 ? "−" : "+";
		formula += formula ? ` ${sign} ` : sign === "−" ? "−" : "";
		formula += `${magnitude === 1 && exponent > 0 ? "" : magnitude}${POWERS[exponent]}`;
	}

	return isRounded ? `≈${formula}` : formula;
}
