import {
	type Snowflake,
	DATABASE_LIMITS,
	DATABASE_PREMIUM_LIMITS,
	DEFAULT_ROLE_COLOUR,
	MAX_SNOWFLAKE,
	MIN_SNOWFLAKE,
} from "./constants";

export type CorrectSnowflakeTypes<T> = {
	[K in keyof T]: K extends "id" ? Snowflake : CorrectSnowflakeTypes<T[K]>;
};

export type DeepMutable<T> = { -readonly [K in keyof T]: DeepMutable<T[K]> };

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

/**
 * Rounds a number to n decimal places.
 *
 * @param number - The number that will be rounded.
 * @param decimals - The amount of decimal places to round the number to.
 */
export function roundNumberToNDecimalPlaces(number: number, decimals = 2): number {
	return parseFloatStrict(number.toFixed(decimals));
}

export function parseMultiplier(phrase: string): number | null {
	const numberCandidate = phrase.replace(/x/gi, "");
	if (!numberCandidate) {
		return null;
	}

	const number = roundNumberToNDecimalPlaces(Number(numberCandidate));
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

export function isNumeric(str: string): boolean {
	if (typeof str !== "string") {
		return false;
	}

	// eslint-disable-next-line unicorn/prefer-number-properties
	return !isNaN(str as unknown as number) && !Number.isNaN(Number.parseFloat(str));
}

export function getDatabaseLimit<
	K extends keyof typeof DATABASE_LIMITS & keyof typeof DATABASE_PREMIUM_LIMITS = keyof typeof DATABASE_LIMITS,
>(key: K, premium: boolean): typeof DATABASE_LIMITS[K] | typeof DATABASE_PREMIUM_LIMITS[K] {
	if (premium) {
		return DATABASE_PREMIUM_LIMITS[key];
	}

	return DATABASE_LIMITS[key];
}

export function removeNonStringValues(obj: Record<string, any>): Record<string, string> {
	return Object.keys(obj)
		.filter((key) => typeof obj[key] === "string")
		.reduce<Record<string, string>>((acc, key) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			acc[key] = obj[key];
			return acc;
		}, {});
}

export function inProductionEnvironment(): boolean {
	return process.env.NODE_ENV !== "development";
}
