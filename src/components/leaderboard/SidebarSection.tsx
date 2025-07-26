import type { PropsWithChildren, ReactNode } from "react";

export function SidebarSection({ title, titleAction, children }: SidebarSectionProps) {
	return (
		<div className="rounded-lg border border-white/25 bg-dark-gray px-2 py-1.5">
			<div className="mb-2 flex items-center justify-between border-white/25 border-b pb-2">
				<h3 className="text-lg">{title}</h3>
				{titleAction}
			</div>

			{children}
		</div>
	);
}

type SidebarSectionProps = PropsWithChildren<{ readonly title: string; readonly titleAction?: ReactNode }>;
