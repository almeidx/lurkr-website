import type { PropsWithChildren } from "react";

export function Label({ children, htmlFor, sub }: LabelProps) {
	return (
		<label
			className="flex flex-wrap items-center gap-x-2 gap-y-1 md:flex-nowrap md:items-end md:gap-x-2"
			htmlFor={htmlFor}
		>
			<p className="text-lg text-white/75 tracking-tight md:text-xl">{children}</p>
			<p className="mb-1 font-light text-white/50 text-xs">({sub})</p>
		</label>
	);
}

interface LabelProps extends PropsWithChildren {
	readonly sub: string;
	readonly htmlFor?: string;
}
