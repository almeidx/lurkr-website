import {
	type Snowflake,
	DATABASE_LIMITS,
	DATABASE_PREMIUM_LIMITS,
	DEFAULT_ROLE_COLOUR,
	MAX_SNOWFLAKE,
	MIN_SNOWFLAKE,
} from "./constants";

type RGBColourString = `rgb(${number}, ${number}, ${number})`;

/**
 * Checks if a string could potentially be a valid Discord Snowflake
 *
 * @param str - The string to check
 */
export function isValidSnowflake(str: string): str is Snowflake {
	return /^[1-9]\d{16,19}$/.test(str) && Number.parseInt(str, 10) >= MIN_SNOWFLAKE && BigInt(str) < MAX_SNOWFLAKE;
}

export function parseIntStrict(number: string): number {
	return Number.parseInt(Number(number).toString(), 10);
}

export const parseFloatStrict = Number;

export function parseMultiplier(phrase: string): number | null {
	const numberCandidate = phrase.replaceAll(/x/gi, "");
	if (!numberCandidate) {
		return null;
	}

	const number = parseFloatStrict(Number(numberCandidate).toFixed(2));
	if (!number || number <= 0 || number > 5) {
		return null;
	}

	return number;
}

function hexToRgb(hex: number): RGBColourString {
	const red = (hex >> 16) & 255;
	const green = (hex >> 8) & 255;
	const blue = hex & 255;

	return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Returns a hexadecimal colour or its default value if it doesn't exist
 *
 * @param colour - The colour number
 */
export function resolveColour(colour: number): RGBColourString {
	return colour ? hexToRgb(colour) : DEFAULT_ROLE_COLOUR;
}

/**
 * Formats a float number and doesn't keep .00 on round numbers.
 *
 * @param number - The float number to round.
 * @param decimals - The amount of decimal places to keep.
 */
export function formatNumberToNDecimalPlaces(number: number, decimals = 2): string {
	return Number(number.toFixed(decimals)).toString();
}

export function getDatabaseLimit<
	K extends keyof typeof DATABASE_LIMITS & keyof typeof DATABASE_PREMIUM_LIMITS = keyof typeof DATABASE_LIMITS,
>(key: K, premium: boolean): typeof DATABASE_LIMITS[K] | typeof DATABASE_PREMIUM_LIMITS[K] {
	if (premium) {
		return DATABASE_PREMIUM_LIMITS[key];
	}

	return DATABASE_LIMITS[key];
}

export function inProductionEnvironment(): boolean {
	return process.env.NODE_ENV !== "development";
}
