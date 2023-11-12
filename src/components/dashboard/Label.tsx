import type { PropsWithChildren } from "react";

export function Label({ children, htmlFor, sub }: LabelProps) {
	return (
		<label
			className="flex flex-wrap items-center md:flex-nowrap md:items-end gap-x-2 gap-y-1 md:gap-x-2"
			htmlFor={htmlFor}
		>
			<p className="text-lg tracking-tight text-white/75 md:text-xl">{children}</p>
			<p className="mb-1 text-xs font-light text-white/50">({sub})</p>
		</label>
	);
}

interface LabelProps extends PropsWithChildren {
	readonly sub: string;
	readonly htmlFor?: string;
}
