export function snowflakes(count: number): string[] {
	return Array.from({ length: count }, (_, index) => `1${index.toString().padStart(17, "0")}`);
}
