import type { PropsWithChildren } from "react";
import { Warning } from "@/components/icons/mdi/warning.tsx";

export function WarningBanner({ children }: PropsWithChildren) {
	return (
		<div
			className="flex items-center gap-3 rounded-lg border border-[#ff707780] bg-[#ff707726] px-4 py-3 text-white"
			role="status"
		>
			<Warning className="size-5 shrink-0 text-[#ff7077]" />
			<p>{children}</p>
		</div>
	);
}
