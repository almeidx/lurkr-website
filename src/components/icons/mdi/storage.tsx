import type { ComponentProps } from "react";

export function Storage(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M3 20v-4h18v4zm2-1h2v-2H5zM3 8V4h18v4zm2-1h2V5H5zm-2 7v-4h18v4zm2-1h2v-2H5z" />
		</svg>
	);
}
