// XP chart — exact preset formulas from dash/src/lib/guild-config.ts
// Lurkr: [150,-100,50]       → 50n²−100n+150
// Amari: [55,-40,20]         → 20n²−40n+55
// MEE6:  [0,455/6,45/2,5/3]  → ≈(5/3)n³+(45/2)n²+(455/6)n

const XP_CHART_MAX = (5 / 3) * 50 ** 3 + (45 / 2) * 50 ** 2 + (455 / 6) * 50; // MEE6 @ lv50 ≈ 268,375

function xpPolyPoints(formula: (n: number) => number): string {
	return Array.from({ length: 50 }, (_, i) => {
		const n = i + 1;
		const x = 8 + (i * 404) / 49;
		const y = 100 - (Math.max(0, formula(n)) / XP_CHART_MAX) * 92;
		return `${x.toFixed(1)},${y.toFixed(2)}`;
	}).join(" ");
}

export const POLY_LURKR = xpPolyPoints((n) => 50 * n ** 2 - 100 * n + 150);
export const POLY_AMARI = xpPolyPoints((n) => 20 * n ** 2 - 40 * n + 55);
export const POLY_MEE6 = xpPolyPoints((n) => (5 / 3) * n ** 3 + (45 / 2) * n ** 2 + (455 / 6) * n);

// Pre-computed endpoint y-values at n=50: Lurkr≈58.77  MEE6=8.00  Amari≈83.51
export const Y50_LURKR = (100 - (120_150 / XP_CHART_MAX) * 92).toFixed(2);
export const Y50_MEE6 = "8.00";
export const Y50_AMARI = (100 - (48_055 / XP_CHART_MAX) * 92).toFixed(2);
