/**
 * @example
 * formatToNearestOrderOfMagnitude(1234); // 1000
 * formatToNearestOrderOfMagnitude(12345); // 12000
 * formatToNearestOrderOfMagnitude(123456); // 120000
 * formatToNearestOrderOfMagnitude(1234567); // 1200000
 * formatToNearestOrderOfMagnitude(12345678); // 12000000
 */
export function formatToNearestOrderOfMagnitude(num: number) {
	if (num < 10) {
		return num;
	}

	const power = Math.floor(Math.log10(num)) - 1;
	const base = 10 ** power;
	return Math.floor(num / base) * base;
}
