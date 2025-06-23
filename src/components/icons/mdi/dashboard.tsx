import type { ComponentProps } from "react";

export function Dashboard(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z" fill="currentColor" />
		</svg>
	);
}
