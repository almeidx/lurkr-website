"use client";

import { ArrowUpward } from "@mui/icons-material";

export function BackToTheTop() {
	return (
		<button
			className="flex items-center justify-center gap-1 whitespace-nowrap text-sm text-white/75"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			type="button"
		>
			<p>Lost? Back to the top</p>
			<ArrowUpward className="size-8 fill-icon-gradient-primary" />
		</button>
	);
}
