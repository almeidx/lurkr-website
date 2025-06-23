import type { ComponentProps } from "react";

export function ReportProblem(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z" fill="currentColor" />
		</svg>
	);
}
