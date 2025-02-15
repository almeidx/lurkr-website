import type { ComponentProps } from "react";

export function Toggle({ id, disabled, initialValue, ...props }: ToggleProps) {
	return (
		<label className="relative flex h-6 w-11 cursor-pointer items-center" htmlFor={id}>
			<input
				defaultChecked={initialValue}
				disabled={disabled}
				id={id}
				name={id}
				className="peer sr-only"
				type="checkbox"
				{...props}
			/>
			<div className="peer h-6 w-11 rounded-full border-red-800 bg-red after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-green peer-checked:after:translate-x-full peer-checked:after:border-white" />
		</label>
	);
}

type ToggleProps =
	| {
			readonly disabled?: boolean;
			readonly id: string;
			readonly initialValue: boolean;
	  }
	| (ComponentProps<"input"> & {
			initialValue?: boolean;
	  });
