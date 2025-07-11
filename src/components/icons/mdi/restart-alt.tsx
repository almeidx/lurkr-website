import type { ComponentProps } from "react";

export function RestartAlt(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M11 20.95q-3.025-.375-5.012-2.637T4 13q0-1.65.65-3.162T6.5 7.2l1.425 1.425q-.95.85-1.437 1.975T6 13q0 2.2 1.4 3.888T11 18.95zm2 0v-2q2.175-.4 3.588-2.075T18 13q0-2.5-1.75-4.25T12 7h-.075l1.1 1.1l-1.4 1.4l-3.5-3.5l3.5-3.5l1.4 1.4l-1.1 1.1H12q3.35 0 5.675 2.325T20 13q0 3.025-1.987 5.288T13 20.95"
				fill="currentColor"
			/>
		</svg>
	);
}
