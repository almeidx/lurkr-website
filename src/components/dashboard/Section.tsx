import type { PropsWithChildren } from "react";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";

export function Section(props: SectionProps) {
	const { children, id, name } = props;

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-white/25 bg-dark-gray px-6 py-8" id={id}>
			{name && (
				<h3 className="flex items-center font-semibold text-xl md:text-2xl">
					{name}
					{"docsPath" in props && <DocsBubble path={props.docsPath} tooltip={props.tooltip} />}
				</h3>
			)}

			{children}
		</div>
	);
}

type SectionProps =
	| BaseSectionProps
	| (BaseSectionProps & {
			readonly docsPath: string;
			readonly tooltip: string;
	  });

type BaseSectionProps = PropsWithChildren<{
	readonly name?: string;
	readonly id?: string;
}>;
