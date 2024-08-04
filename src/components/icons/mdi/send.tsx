import type { ComponentProps } from "react";

export function Send(props: ComponentProps<"svg">) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" />
		</svg>
	);
}
