import type { ReactNode } from "react";

export function GuildGrid({ children }: { children: ReactNode }) {
	return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{children}</div>;
}
