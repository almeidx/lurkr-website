import { describe, expect, it } from "vitest";
import { formatToNearestOrderOfMagnitude } from "@/utils/format-to-nearest-order-of-magnitude.ts";

describe("formatToNearestOrderOfMagnitude", () => {
	it.each([0, 1, 9])("leaves the single digit %i as it is", (value) => {
		expect(formatToNearestOrderOfMagnitude(value)).toBe(value);
	});

	it.each([10, 42, 99])("leaves the two digit number %i as it is", (value) => {
		expect(formatToNearestOrderOfMagnitude(value)).toBe(value);
	});

	it.each([
		[100, 100],
		[109, 100],
		[110, 110],
		[999, 990],
		[12_345, 12_000],
		[99_999, 99_000],
		[100_000, 100_000],
		[123_456, 120_000],
		[1_234_567, 1_200_000],
		[12_345_678, 12_000_000],
	])("rounds %i down to %i, keeping two significant digits", (value, expected) => {
		expect(formatToNearestOrderOfMagnitude(value)).toBe(expected);
	});

	it("never rounds up", () => {
		expect(formatToNearestOrderOfMagnitude(199_999)).toBe(190_000);
	});
});
