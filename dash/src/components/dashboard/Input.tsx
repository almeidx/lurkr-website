import clsx from "clsx";
import type { ComponentProps } from "react";

export function Input({ className, id, name = id, placeholder, ...props }: InputProps) {
	return (
		<input
			{...props}
			className={clsx("max-w-3xl min-w-48 rounded-lg bg-light-gray p-2 px-3 shadow-dim-inner", className)}
			id={id}
			name={name ?? undefined}
			placeholder={placeholder}
		/>
	);
}

interface InputProps extends Omit<ComponentProps<"input">, "name"> {
	readonly id: string;
	/** Form field to submit the value in. Defaults to `id`; `null` doesn't submit it. */
	readonly name?: string | null;
	readonly placeholder: string;
}
