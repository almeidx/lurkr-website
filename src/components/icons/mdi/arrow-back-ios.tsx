import type { ComponentProps } from "react";

export function ArrowBackIos(props: ComponentProps<"svg">) {
	return (
		<svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M10 22L0 12L10 2l1.775 1.775L3.55 12l8.225 8.225z" fill="currentColor" />
		</svg>
	);
}
