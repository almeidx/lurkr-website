import type { PropsWithChildren } from "react";

export function Checkbox({ defaultValue, id }: CheckboxProps) {
	return (
		<input
			className="size-5 rounded-lg accent-primary"
			defaultChecked={defaultValue}
			id={id}
			name={id}
			type="checkbox"
		/>
	);
}

interface CheckboxProps extends PropsWithChildren {
	defaultValue: boolean;
	id: string;
}
