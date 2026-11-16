function timeOfDay() {
	const hour = new Date().getHours();

	if (hour >= 5 && hour < 12) return "morning";
	if (hour >= 12 && hour < 17) return "afternoon";
	if (hour >= 17 && hour < 20) return "evening";
	return "night";
}

export function greeting(name: string) {
	const time = timeOfDay();
	return `Good ${time === "night" ? "evening" : time}, ${name}!`;
}

/** E.g. `"this morning"`. */
export function timePeriod() {
	const time = timeOfDay();
	return time === "night" ? "tonight" : `this ${time}`;
}
