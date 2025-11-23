export function isValidDate(date: Date | undefined): date is Date {
	return date instanceof Date && !Number.isNaN(date.getTime());
}
