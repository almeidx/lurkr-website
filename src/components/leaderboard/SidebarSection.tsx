import type { PropsWithChildren } from "react";

export function SidebarSection({ title, children }: PropsWithChildren & { readonly title: string }) {
	return (
		<div className="rounded-lg border border-white/25 bg-dark-gray px-2 py-1.5">
			<h3 className="mb-2 border-white/25 border-b text-lg">{title}</h3>

			{children}
		</div>
	);
}
