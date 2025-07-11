import type { ComponentProps } from "react";

export function AutoStories(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.45 0 2.838.375T12 5.5v12.1q1.275-.8 2.675-1.2T17.5 16q.9 0 1.763.15T21 16.6v-12q.375.125.738.263t.712.337q.275.125.413.375T23 6.1v12.05q0 .575-.487.875t-1.013.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20m2-5V5.5l5-5v10z"
				fill="currentColor"
			/>
		</svg>
	);
}
