/**
 * Formats a number to the nearest order of magnitude.
 *
 * @example
 * formatToNearestOrderOfMagnitude(1234); // 1000
 * formatToNearestOrderOfMagnitude(12345); // 12000
 * formatToNearestOrderOfMagnitude(123456); // 120000
 * formatToNearestOrderOfMagnitude(1234567); // 1200000
 * formatToNearestOrderOfMagnitude(12345678); // 12000000
 *
 * @param num - The number to be formatted.
 * @returns The formatted number.
 */
export function formatToNearestOrderOfMagnitude(num: number) {
	if (num < 10) {
		return num;
	}

	const power = Math.floor(Math.log10(num)) - 1;
	const base = 10 ** power;
	return Math.floor(num / base) * base;
}
