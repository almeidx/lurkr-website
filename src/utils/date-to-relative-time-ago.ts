import { Time } from "./time.ts";

// Adapted from https://stackoverflow.com/a/62029040/11252146
export function dateToRelativeTimeAgo(timestamp: Date, locale: string) {
	const current = Date.now();
	const elapsed = current - timestamp.getTime();

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

	if (elapsed < Time.Minutes) {
		return rtf.format(-Math.floor(elapsed / Time.Seconds), "seconds");
	}

	if (elapsed < Time.Hours) {
		return rtf.format(-Math.floor(elapsed / Time.Minutes), "minutes");
	}

	if (elapsed < Time.Days) {
		return rtf.format(-Math.floor(elapsed / Time.Hours), "hours");
	}

	if (elapsed < Time.Months) {
		return rtf.format(-Math.floor(elapsed / Time.Days), "days");
	}

	if (elapsed < Time.Years) {
		return rtf.format(-Math.floor(elapsed / Time.Months), "months");
	}

	return rtf.format(-Math.floor(elapsed / Time.Years), "years");
}
