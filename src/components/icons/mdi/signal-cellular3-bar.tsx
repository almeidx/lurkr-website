import type { ComponentProps } from "react";

export function SignalCellular3Bar(props: ComponentProps<"svg">) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M2 22L22 2v20zm13-2h5V6.85l-5 5z" />
		</svg>
	);
}
