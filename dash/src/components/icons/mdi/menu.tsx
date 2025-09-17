import type { ComponentProps } from "react";

export function Menu(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" fill="currentColor" />
		</svg>
	);
}
