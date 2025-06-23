import type { ComponentProps } from "react";

export function Send(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M3 20v-6l8-2l-8-2V4l19 8z" fill="currentColor" />
		</svg>
	);
}
