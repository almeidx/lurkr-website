// Time constants in seconds
const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Converts seconds to a human readable format.
 * Returns the two largest applicable units (e.g., "1h 30m", "2d 4h", "1y 2mo")
 *
 * @param seconds - The number of seconds to convert
 * @returns A formatted string representing the duration
 * @throws {RangeError} If the input is a negative or infinite number
 */
export function prettySeconds(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) {
		throw new RangeError("The input must be a non-negative finite number.");
	}

	if (seconds < MINUTE) {
		return `${seconds}s`;
	}

	if (seconds < HOUR) {
		const minutes = Math.trunc(seconds / MINUTE);
		const secondsLeft = seconds % MINUTE;

		if (secondsLeft === 0) {
			return `${minutes}m`;
		}

		return `${minutes}m ${secondsLeft}s`;
	}

	if (seconds < DAY) {
		const hours = Math.trunc(seconds / HOUR);
		const minutes = Math.trunc((seconds % HOUR) / MINUTE);

		if (minutes === 0) {
			return `${hours}h`;
		}

		return `${hours}h ${minutes}m`;
	}

	if (seconds < MONTH) {
		const days = Math.trunc(seconds / DAY);
		const hours = Math.trunc((seconds % DAY) / HOUR);

		if (hours === 0) {
			return `${days}d`;
		}

		return `${days}d ${hours}h`;
	}

	if (seconds < YEAR) {
		const months = Math.trunc(seconds / MONTH);
		const days = Math.trunc((seconds % MONTH) / DAY);

		if (days === 0) {
			return `${months}mo`;
		}

		return `${months}mo ${days}d`;
	}

	const years = Math.trunc(seconds / YEAR);
	const months = Math.trunc((seconds % YEAR) / MONTH);

	if (months === 0) {
		return `${years}y`;
	}

	return `${years}y ${months}mo`;
}
