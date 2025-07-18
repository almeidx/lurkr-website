import clsx from "clsx";
import type { ComponentProps } from "react";

export function Input({ className, id, placeholder, ...props }: InputProps) {
	return (
		<input
			{...props}
			className={clsx("min-w-48 max-w-3xl rounded-lg bg-light-gray p-2 px-3 shadow-dim-inner", className)}
			id={id}
			name={id}
			placeholder={placeholder}
		/>
	);
}

interface InputProps extends Omit<ComponentProps<"input">, "name"> {
	readonly id: string;
	readonly placeholder: string;
}
