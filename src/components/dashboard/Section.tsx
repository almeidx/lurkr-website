import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import type { PropsWithChildren } from "react";

export function Section({ children, docsPath, name }: SectionProps) {
	return (
		<div className="flex flex-col gap-4 rounded-lg border border-white bg-dark-gray px-6 py-8">
			{name && (
				<h3 className="flex items-center text-2xl font-semibold">
					{name}
					{docsPath && <DocsBubble path={docsPath} />}
				</h3>
			)}

			{children}
		</div>
	);
}

type SectionProps = PropsWithChildren<{
	readonly docsPath?: string;
	readonly name?: string;
}>;
