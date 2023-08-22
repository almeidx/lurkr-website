import type { ReactNode } from "react";

export default function Field({ children, direction, ...props }: FieldProps): JSX.Element {
	return (
		<div className={`${direction === "row" ? "" : "flex-col "}flex w-full`} {...props}>
			{children}
		</div>
	);
}

interface FieldProps {
	readonly children: ReactNode;
	readonly direction?: string;
}
