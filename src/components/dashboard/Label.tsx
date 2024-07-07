import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function Label({ children, htmlFor, sub, small }: LabelProps) {
	return (
		<label
			className="flex flex-wrap items-center gap-x-2 gap-y-1 md:flex-nowrap md:items-end md:gap-x-2"
			htmlFor={htmlFor}
		>
			<p className={clsx("text-white/75 tracking-tight", small ? "text-md md:text-lg" : "text-lg md:text-xl")}>
				{children}
			</p>{" "}
			{sub ? <p className="mb-1 font-light text-white/50 text-xs">({sub})</p> : null}
		</label>
	);
}

interface LabelProps extends PropsWithChildren {
	readonly sub?: string;
	readonly htmlFor?: string;
	readonly small?: boolean;
}
