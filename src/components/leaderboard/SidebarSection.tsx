import type { PropsWithChildren } from "react";

export function SidebarSection({ children }: PropsWithChildren) {
	return (
		<div className="flex min-w-full flex-col items-center gap-4 rounded-lg border border-white bg-dark-gray px-5 py-8">
			{children}
		</div>
	);
}
