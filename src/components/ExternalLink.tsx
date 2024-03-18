import type { ComponentProps, PropsWithChildren } from "react";

export function ExternalLink({ children, ...props }: PropsWithChildren<ComponentProps<"a">>) {
	return (
		<a {...props} rel="external noopener noreferrer" target="_blank">
			{children}
		</a>
	);
}
