import type { ComponentProps } from "react";

export function ExpandMore(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" fill="currentColor" />
		</svg>
	);
}
