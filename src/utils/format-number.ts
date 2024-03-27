/**
 * Adds suffixes to large numbers, e.g. 8.6k, 9.4M, 3.2B, etc.
 *
 * @param num - The number to format
 * @param withDecimal - Whether to include a decimal place
 */
export function formatNumber(num: number, withDecimal = true) {
	if (num < 1_000) {
		return round(num, withDecimal);
	}

	if (num < 1_000_000) {
		return `${round(num / 1_000, withDecimal)}k`;
	}

	if (num < 1_000_000_000) {
		return `${round(num / 1_000_000, withDecimal)}M`;
	}

	return `${round(num / 1_000_000_000, withDecimal)}B`;
}

function round(num: number, withDecimal: boolean) {
	const str = withDecimal ? num.toFixed(1) : Math.floor(num).toString();
	if (str.endsWith(".0")) {
		return str.slice(0, -2);
	}

	return str;
}
