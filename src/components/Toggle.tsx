export function Toggle({ id, initialValue, disabled }: ToggleProps) {
	return (
		<label className="relative flex h-6 w-11 cursor-pointer items-center" htmlFor={id}>
			<input
				defaultChecked={initialValue}
				disabled={disabled}
				id={id}
				name={id}
				className="peer sr-only"
				type="checkbox"
			/>
			<div className="peer h-6 w-11 rounded-full border-red-800 bg-red after:absolute after:top-0.5 after:left-[2px] after:size-5 peer-checked:after:translate-x-full after:rounded-full after:border after:border-gray-300 peer-checked:after:border-white after:bg-white peer-checked:bg-green after:transition-all" />
		</label>
	);
}

interface ToggleProps {
	readonly disabled?: boolean;
	readonly id: string;
	readonly initialValue: boolean;
}
