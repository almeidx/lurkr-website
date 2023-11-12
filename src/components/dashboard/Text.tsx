import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import type { PropsWithChildren } from "react";

export function Text({ children, docsPath, htmlFor }: TextProps) {
	const Element = htmlFor ? "label" : "span";

	return (
		<Element className="flex items-center gap-2 text-xl tracking-tight text-white/75" htmlFor={htmlFor}>
			{children}
			{docsPath && <DocsBubble path={docsPath} />}
		</Element>
	);
}

type TextProps = PropsWithChildren<{
	readonly docsPath?: string;
	/**
	 * The value of the `htmlFor` attribute of the label.
	 *
	 * @remarks
	 * Makes this component a label instead of a span.
	 */
	readonly htmlFor?: string;
}>;
