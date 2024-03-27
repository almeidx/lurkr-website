/**
 * Converts FormData to an object
 *
 * @param data - The FormData to convert
 */
export function formDataToObject(data: FormData) {
	const entries = Array.from(data.entries());
	return Object.fromEntries(entries);
}
