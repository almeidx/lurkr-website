import type { ComponentProps } from "react";

export function Calculate(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M8 18h1.5v-2h2v-1.5h-2v-2H8v2H6V16h2zm5-.75h5v-1.5h-5zm0-2.5h5v-1.5h-5zm1.1-3.8l1.4-1.4l1.4 1.4l1.05-1.05l-1.4-1.45l1.4-1.4L16.9 6l-1.4 1.4L14.1 6l-1.05 1.05l1.4 1.4l-1.4 1.45zM6.25 9.2h5V7.7h-5zM5 21q-.825 0-1.413-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"
				fill="currentColor"
			/>
		</svg>
	);
}
