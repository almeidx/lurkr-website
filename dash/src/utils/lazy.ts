/**
 * Lazily compute a value.
 *
 * @param compute - The function to compute the value
 */
export function lazy<Value>(compute: () => Value) {
	let value: Value | undefined;

	return () => {
		value ??= compute();
		return value;
	};
}
