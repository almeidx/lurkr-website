import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function Text(props: TextProps) {
	const { children, htmlFor } = props;

	const Element = htmlFor ? "label" : "span";
	const hasDocsPath = "docsPath" in props;

	return (
		<Element
			className={clsx("text-lg md:text-xl tracking-tight text-white/75", hasDocsPath && "flex items-center gap-2")}
			htmlFor={htmlFor}
		>
			{children}
			{hasDocsPath ? <DocsBubble path={props.docsPath} tooltip={props.tooltip} /> : null}
		</Element>
	);
}

type TextProps =
	| BaseTextProps
	| (BaseTextProps & {
			readonly docsPath: string;
			readonly tooltip: string;
	  });

type BaseTextProps = PropsWithChildren<{
	/**
	 * The value of the `htmlFor` attribute of the label.
	 *
	 * @remarks
	 * Makes this component a label instead of a span.
	 */
	readonly htmlFor?: string;
}>;
