/**
 * Returns the time period of the day
 */
export function getTimePeriod() {
	const hour = new Date().getHours();

	if (hour >= 5 && hour < 12) {
		return "this morning";
	}

	if (hour >= 12 && hour < 17) {
		return "this afternoon";
	}

	if (hour >= 17 && hour < 20) {
		return "this evening";
	}

	return "tonight";
}
