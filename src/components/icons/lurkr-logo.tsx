import logoSmallImg from "@/assets/logo-small.webp";
import { cx } from "@/lib/utils.ts";
import Image from "next/image";
import * as React from "react";

export function LurkrLogo({ className }: { className?: string }) {
	return (
		<div className={cx("flex flex-1 items-center gap-2", className)}>
			<Image alt="Lurkr logo" className="size-10" height={40} width={40} priority quality={100} src={logoSmallImg} />

			<p className="font-bold font-mono text-xl lowercase">Lurkr</p>
		</div>
	);
}
