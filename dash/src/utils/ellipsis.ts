/**
 * Limits the length of a string and adds an ellipsis if the string is too long
 *
 * @param text - The text to limit the length of
 * @param maxLength - The maximum length of the text
 */
export function ellipsis(text: string, maxLength: number): string {
	if (text.length > maxLength) {
		return `${text.slice(0, maxLength - 1)}…`;
	}

	return text;
}
