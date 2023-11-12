"use client";

import { MdArrowUpward } from "@react-icons/all-files/md/MdArrowUpward";

export function BackToTheTop() {
	return (
		<button
			className="flex items-center justify-center gap-1 whitespace-nowrap text-sm text-white/75"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			type="button"
		>
			<p>Lost? Back to the top</p>
			<MdArrowUpward className="fill-icon-gradient-primary" size={32} />
		</button>
	);
}
