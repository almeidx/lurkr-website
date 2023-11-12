import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import type { PropsWithChildren } from "react";

export function Section(props: SectionProps) {
	const { children, name } = props;

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-white/25 bg-dark-gray px-6 py-8">
			{name && (
				<h3 className="flex items-center text-xl md:text-[1.4rem] font-semibold">
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
}>;
