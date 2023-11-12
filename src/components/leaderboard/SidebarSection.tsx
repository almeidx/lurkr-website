import type { PropsWithChildren } from "react";

export function SidebarSection({ title, children }: PropsWithChildren & { readonly title: string }) {
	return (
		<div className="bg-dark-gray border border-white/25 rounded-lg px-2 py-1.5">
			<h3 className="text-lg border-b border-white/25 mb-2">{title}</h3>

			{children}
		</div>
	);
}
