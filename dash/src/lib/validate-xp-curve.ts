import { MAX_XP_CURVE_COEFFICIENTS, MIN_XP_CURVE_COEFFICIENTS } from "@/lib/guild-config.ts";

const SAMPLE_LEVELS = [0, 1, 2, 5, 10, 25, 50, 100, 250, 500, 750, 1000];

export function validateXpCurve(coefficients: readonly number[]): { valid: boolean; error?: string } {
	if (coefficients.length < MIN_XP_CURVE_COEFFICIENTS || coefficients.length > MAX_XP_CURVE_COEFFICIENTS) {
		return {
			error: `Number of coefficients must be between ${MIN_XP_CURVE_COEFFICIENTS} and ${MAX_XP_CURVE_COEFFICIENTS}`,
			valid: false,
		};
	}

	let hasNonZero = false;
	for (let i = 0; i < coefficients.length; i++) {
		const coeff = coefficients[i]!;
		if (!Number.isFinite(coeff)) {
			return {
				error: `Coefficient at index ${i} is not a finite number.`,
				valid: false,
			};
		}

		if (coeff !== 0) {
			hasNonZero = true;
		}
	}

	if (!hasNonZero) {
		return {
			error: "All coefficients cannot be zero. At least one non-zero coefficient is required.",
			valid: false,
		};
	}

	let previousRawXp = 0;
	let previousLevel = 0;

	for (const level of SAMPLE_LEVELS) {
		const rawXp = level <= 0 ? 0 : Math.round(coefficients.reduce((sum, coeff, exp) => sum + coeff * level ** exp, 0));

		if (rawXp < 0) {
			return {
				error: `XP cannot be negative. At level ${level}, XP would be ${rawXp}.`,
				valid: false,
			};
		}

		if (level > 0 && rawXp <= previousRawXp) {
			return {
				error: `XP must strictly increase with each level. Level ${level} requires ${rawXp} XP, same as or less than level ${previousLevel} (${previousRawXp} XP).`,
				valid: false,
			};
		}

		previousRawXp = rawXp;
		previousLevel = level;

		if (level > 0) {
			const derivative = coefficients.slice(1).reduce((sum, coeff, exp) => {
				const power = exp + 1;
				return sum + power * coeff * level ** exp;
			}, 0);

			if (derivative < 0) {
				return {
					error: `The curve decreases at level ${level}. XP must increase with each level.`,
					valid: false,
				};
			}
		}
	}

	return { valid: true };
}
