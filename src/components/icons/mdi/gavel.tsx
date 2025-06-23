import type { ComponentProps } from "react";

export function Gavel(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M4 21v-2h12v2zm5.65-4.85L4 10.5l2.1-2.15L11.8 14zM16 9.8l-5.65-5.7L12.5 2l5.65 5.65zM20.6 20L7.55 6.95l1.4-1.4L22 18.6z"
				fill="currentColor"
			/>
		</svg>
	);
}
