import type { ComponentProps } from "react";

export function Patreon(props: ComponentProps<"svg">) {
	return (
		<svg
			fill="currentColor"
			height={200}
			stroke="currentColor"
			strokeWidth={0}
			viewBox="0 0 512 512"
			width={200}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M512 194.8c0 101.3-82.4 183.8-183.8 183.8-101.7 0-184.4-82.4-184.4-183.8 0-101.6 82.7-184.3 184.4-184.3C429.6 10.5 512 93.2 512 194.8zM0 501.5h90v-491H0v491z" />
		</svg>
	);
}
