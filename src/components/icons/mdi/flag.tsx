import type { ComponentProps } from "react";

export function Flag(props: ComponentProps<"svg">) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7z" />
		</svg>
	);
}
