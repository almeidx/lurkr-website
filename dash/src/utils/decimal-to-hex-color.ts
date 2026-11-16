const DEFAULT_ROLE_COLOR = "#99aab5";

export function decimalRoleColorToHex(decimal: number) {
	const hex = decimal.toString(16);

	if (hex === "0") {
		return DEFAULT_ROLE_COLOR;
	}

	return `#${hex.padStart(6, "0")}` as const;
}
