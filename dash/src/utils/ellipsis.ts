export function ellipsis(text: string, maxLength: number): string {
	if (text.length > maxLength) {
		return `${text.slice(0, maxLength - 1)}…`;
	}

	return text;
}
