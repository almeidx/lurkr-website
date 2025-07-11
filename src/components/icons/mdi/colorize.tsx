import type { ComponentProps } from "react";

export function Colorize(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M3 21v-4.75l8.95-8.95l-1.45-1.4l1.45-1.4l1.9 1.9l3.1-3.1q.125-.125.313-.2t.387-.075t.375.075t.325.2l2.35 2.35q.125.15.2.325t.075.375t-.075.387t-.2.313l-3.075 3.075l1.9 1.95L18.1 13.5l-1.4-1.45L7.75 21zm2-2h1.95l8.3-8.35l-1.9-1.9L5 17.05z"
				fill="currentColor"
			/>
		</svg>
	);
}
