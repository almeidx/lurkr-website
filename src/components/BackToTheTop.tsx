"use client";

import { ArrowUpward } from "@/components/icons/mdi/arrow-upward.tsx";

export function BackToTheTop() {
	return (
		<button
			className="flex items-center justify-center gap-1 whitespace-nowrap text-sm text-white/75"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			type="button"
		>
			<p>Lost? Back to the top</p>
			<ArrowUpward className="size-8" fill="url(#icon-gradient-primary)" />
		</button>
	);
}
