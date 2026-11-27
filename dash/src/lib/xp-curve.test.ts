import { describe, expect, it } from "vitest";
import { XP_CURVE_PRESETS } from "@/lib/guild-config.ts";
import { describeXpCurve, xpCurveError, xpForLevel } from "@/lib/xp-curve.ts";

describe("xpForLevel", () => {
	it.each([
		["lurkr", 1, 100],
		["lurkr", 2, 150],
		["lurkr", 10, 4150],
		["lurkr", 100, 490_150],
		["amari", 1, 35],
		["amari", 10, 1655],
		["mee6", 1, 100],
		["mee6", 2, 255],
		["mee6", 10, 4675],
	] as const)("%s preset needs the published XP total at level %i", (preset, level, xp) => {
		expect(xpForLevel(XP_CURVE_PRESETS[preset], level)).toBe(xp);
	});

	it("needs no XP at or below level 0, whatever the constant term", () => {
		expect(xpForLevel([150, -100, 50], 0)).toBe(0);
		expect(xpForLevel([150, -100, 50], -3)).toBe(0);
	});

	it("rounds to the nearest whole XP", () => {
		expect(xpForLevel([0, 0.4], 1)).toBe(0);
		expect(xpForLevel([0, 0.6], 1)).toBe(1);
		expect(xpForLevel([0, 2.5], 3)).toBe(8);
	});

	it.each(Object.entries(XP_CURVE_PRESETS))("%s preset needs more XP for every next level", (_preset, curve) => {
		let previousXp = 0;

		for (let level = 1; level <= 1000; level++) {
			const xp = xpForLevel(curve, level);
			expect(xp, `level ${level}`).toBeGreaterThan(previousXp);
			previousXp = xp;
		}
	});
});

describe("xpCurveError", () => {
	it.each(Object.entries(XP_CURVE_PRESETS))("accepts the %s preset", (_preset, curve) => {
		expect(xpCurveError(curve)).toBeNull();
	});

	it("accepts the smallest and largest number of coefficients", () => {
		expect(xpCurveError([0, 100])).toBeNull();
		expect(xpCurveError([0, 1, 1, 1, 1])).toBeNull();
	});

	it.each([
		["none", []],
		["one", [100]],
		["six", [0, 1, 1, 1, 1, 1]],
	])("rejects a curve with %s coefficients", (_count, curve) => {
		expect(xpCurveError(curve)).toContain("Number of coefficients must be between 2 and 5");
	});

	it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
		"rejects a %d coefficient and says where it is",
		(coefficient) => {
			expect(xpCurveError([0, 100, coefficient])).toContain("index 2 is not a finite number");
		},
	);

	it("rejects a curve of only zeros", () => {
		expect(xpCurveError([0, 0, 0])).toContain("All coefficients cannot be zero");
	});

	it("rejects a curve that goes negative, naming the level and its XP", () => {
		const error = xpCurveError([-100, 50]);

		expect(error).toContain("XP cannot be negative");
		expect(error).toContain("level 1");
		expect(error).toContain("-50");
	});

	it("rejects a flat curve, naming the first level that needs no extra XP", () => {
		const error = xpCurveError([100, 0]);

		expect(error).toContain("XP must strictly increase");
		expect(error).toContain("Level 2 requires 100 XP");
		expect(error).toContain("level 1 (100 XP)");
	});

	it("rejects a curve whose first level rounds down to no XP", () => {
		expect(xpCurveError([0, 0.001])).toContain("XP must strictly increase");
	});

	it("rejects a curve that is past its peak, even while its XP is above the previous sampled level", () => {
		// Peaks at level 8, so level 10 still needs more XP than level 5
		expect(xpForLevel([0, 16, -1], 10)).toBeGreaterThan(xpForLevel([0, 16, -1], 5));
		expect(xpCurveError([0, 16, -1])).toContain("The curve decreases at level 10");
	});

	it("rejects a curve that only starts falling at high levels", () => {
		expect(xpCurveError([0, 1000, -1])).not.toBeNull();
	});
});

describe("describeXpCurve", () => {
	it("writes the terms from the highest power down", () => {
		expect(describeXpCurve([150, -100, 50])).toBe("50n² − 100n + 150");
		expect(describeXpCurve([1, 2, 3, 4, 5])).toBe("5n⁴ + 4n³ + 3n² + 2n + 1");
	});

	it("leaves out terms with a zero coefficient", () => {
		expect(describeXpCurve([0, 100])).toBe("100n");
		expect(describeXpCurve([7, 0, 0, 2])).toBe("2n³ + 7");
	});

	it("leaves out a coefficient of 1, except for the constant", () => {
		expect(describeXpCurve([1, 1, 1])).toBe("n² + n + 1");
		expect(describeXpCurve([0, -1, 1])).toBe("n² − n");
	});

	it("puts the sign of a negative leading term right in front of it", () => {
		expect(describeXpCurve([5, -2])).toBe("−2n + 5");
		expect(describeXpCurve([0, 0, -1])).toBe("−n²");
	});

	it("rounds coefficients to two decimals and marks the formula as approximate", () => {
		expect(describeXpCurve(XP_CURVE_PRESETS.mee6)).toBe("≈1.67n³ + 22.5n² + 75.83n");
	});

	it("does not mark a formula as approximate when nothing was rounded", () => {
		expect(describeXpCurve([0, 0.25, 1.5])).toBe("1.5n² + 0.25n");
	});
});
