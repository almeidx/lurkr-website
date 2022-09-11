import type { ReactNode } from "react";

interface FieldProps {
	children: ReactNode;
	direction?: string;
}

export default function Input({ children, direction, ...props }: FieldProps): JSX.Element {
	return (
		<div className={`${direction === "row" ? "" : "flex-col "}flex w-full`} {...props}>
			{children}
		</div>
	);
}
