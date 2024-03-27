/**
 * Converts seconds to a human readable format.
 *
 * @param seconds - The seconds to convert
 */
export function prettySeconds(seconds: number) {
	if (seconds < 60) {
		return `${seconds}s`;
	}

	if (seconds < 3_600) {
		const minutes = Math.floor(seconds / 60);
		const secondsLeft = seconds % 60;

		if (secondsLeft === 0) {
			return `${minutes}m`;
		}

		return `${minutes}m ${secondsLeft}s`;
	}

	if (seconds < 86_400) {
		const hours = Math.floor(seconds / 3_600);
		const minutes = Math.floor((seconds % 3_600) / 60);

		if (minutes === 0) {
			return `${hours}h`;
		}

		return `${hours}h ${minutes}m`;
	}

	if (seconds < 2_678_400) {
		const days = Math.floor(seconds / 86_400);
		const hours = Math.floor((seconds % 86_400) / 3_600);

		if (hours === 0) {
			return `${days}d`;
		}

		return `${days}d ${hours}h`;
	}

	const years = Math.floor(seconds / 2_678_400);
	const weeks = Math.floor((seconds % 2_678_400) / 86_400);

	if (weeks === 0) {
		return `${years}y`;
	}

	return `${years}y ${weeks}w`;
}
