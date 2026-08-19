import parseDuration from "parse-duration";
import prettyMilliseconds from "pretty-ms";

/**
 * Shared text formatting for minute-based duration sliders (value 0 means off).
 * Matches the behaviour of the mention cooldown slider.
 */
export function formatMinutes(minutes: number): string {
	if (minutes <= 0) return "0m";
	return prettyMilliseconds(minutes * 60_000, { hideYearAndDays: true });
}

export function parseMinutes(input: string): number | null {
	const trimmed = input.trim();
	if (!trimmed) return null;
	if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);

	const minutes = parseDuration(trimmed, "m");
	return minutes === null ? null : Math.round(minutes);
}
