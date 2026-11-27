import { describe, expect, it } from "vitest";
import { prettySeconds } from "@/utils/pretty-seconds.ts";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

describe("prettySeconds", () => {
	it.each([
		[0, "0s"],
		[59, "59s"],
		[MINUTE, "1m"],
		[MINUTE + 1, "1m 1s"],
		[HOUR - 1, "59m 59s"],
		[HOUR, "1h"],
		[HOUR + 30 * MINUTE, "1h 30m"],
		[DAY - 1, "23h 59m"],
		[DAY, "1d"],
		[2 * DAY + 4 * HOUR, "2d 4h"],
		[MONTH - 1, "29d 23h"],
		[MONTH, "1mo"],
		[MONTH + 2 * DAY, "1mo 2d"],
		[YEAR - 1, "12mo 4d"],
		[YEAR, "1y"],
		[YEAR + 2 * MONTH, "1y 2mo"],
		[10 * YEAR, "10y"],
	])("formats %i seconds as %s", (seconds, expected) => {
		expect(prettySeconds(seconds)).toBe(expected);
	});

	it("drops everything below the two largest units", () => {
		expect(prettySeconds(HOUR + MINUTE + 1)).toBe("1h 1m");
		expect(prettySeconds(HOUR + 59)).toBe("1h");
		expect(prettySeconds(2 * DAY + 4 * HOUR + 59 * MINUTE)).toBe("2d 4h");
		expect(prettySeconds(YEAR + 2 * MONTH + 29 * DAY)).toBe("1y 2mo");
	});

	it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])("throws a RangeError for %d", (seconds) => {
		expect(() => prettySeconds(seconds)).toThrow(RangeError);
	});
});
