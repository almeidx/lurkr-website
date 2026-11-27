import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dateToRelativeTimeAgo } from "@/utils/date-to-relative-time-ago.ts";
import { Time } from "@/utils/time.ts";

const NOW = new Date("2025-06-15T12:00:00.000Z");

function ago(milliseconds: number) {
	return new Date(NOW.getTime() - milliseconds);
}

describe("dateToRelativeTimeAgo", () => {
	beforeEach(() => {
		vi.useFakeTimers({ now: NOW });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it.each([
		[0, "now"],
		[Time.Seconds, "1 second ago"],
		[Time.Minutes - 1, "59 seconds ago"],
		[Time.Minutes, "1 minute ago"],
		[Time.Hours - 1, "59 minutes ago"],
		[Time.Hours, "1 hour ago"],
		[Time.Days - 1, "23 hours ago"],
		[Time.Days, "yesterday"],
		[2 * Time.Days, "2 days ago"],
		[Time.Months - 1, "30 days ago"],
		[Time.Months, "last month"],
		[2 * Time.Months, "2 months ago"],
		[Time.Years - 1, "11 months ago"],
		[Time.Years, "last year"],
		[5 * Time.Years, "5 years ago"],
	])("describes a date %i ms in the past as %j", (elapsed, expected) => {
		expect(dateToRelativeTimeAgo(ago(elapsed), "en")).toBe(expected);
	});

	it("writes the result in the requested locale", () => {
		expect(dateToRelativeTimeAgo(ago(3 * Time.Days), "en")).toBe("3 days ago");
		expect(dateToRelativeTimeAgo(ago(3 * Time.Days), "de")).toBe("vor 3 Tagen");
		expect(dateToRelativeTimeAgo(ago(3 * Time.Days), "en")).toBe("3 days ago");
	});

	it("follows the clock as time passes", () => {
		const timestamp = ago(30 * Time.Seconds);

		expect(dateToRelativeTimeAgo(timestamp, "en")).toBe("30 seconds ago");

		vi.advanceTimersByTime(5 * Time.Minutes);

		expect(dateToRelativeTimeAgo(timestamp, "en")).toBe("5 minutes ago");
	});
});
