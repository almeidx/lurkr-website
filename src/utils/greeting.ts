/**
 * Returns a greeting based on the time of day.
 *
 * @param name - The name of the person to greet
 */
export function greeting(name: string) {
	const time = new Date().getHours();

	if (time < 12) {
		return `Good morning, ${name}!`;
	}

	if (time < 18) {
		return `Good afternoon, ${name}!`;
	}

	return `Good evening, ${name}!`;
}
