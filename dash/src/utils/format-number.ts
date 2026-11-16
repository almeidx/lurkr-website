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
