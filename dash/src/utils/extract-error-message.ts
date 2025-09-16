export function extractErrorMessage(error: unknown, defaultMessage: string) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return defaultMessage;
}
