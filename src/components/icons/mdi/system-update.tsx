import type { ComponentProps } from "react";

export function SystemUpdate(props: ComponentProps<"svg">) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M7 23q-.825 0-1.412-.587T5 21V3q0-.825.588-1.412T7 1h10q.825 0 1.413.588T19 3v18q0 .825-.587 1.413T17 23zm0-5h10V6H7zm5-2l-4-4l1.4-1.4l1.6 1.55V8h2v4.15l1.6-1.55L16 12z"
			/>
		</svg>
	);
}
