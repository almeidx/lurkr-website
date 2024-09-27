"use client";

import { Help } from "@/components/icons/mdi/help.tsx";
import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react";
import type { PropsWithChildren } from "react";

export function InfoSection({ children, title, tooltip, raw }: InfoSectionProps) {
	const tooltipStore = useTooltipStore({ showTimeout: 150 });

	return (
		<div className="relative flex h-24 w-64 flex-col items-center justify-between rounded-lg border border-white/25 bg-dark-gray py-2">
			<h2 className="text-center text-white/75 text-xl tracking-tighter">{title}</h2>
			<p className="font-bold text-4xl" {...(raw ? { title: raw.toLocaleString("en-GB") } : undefined)}>
				{children}
			</p>

			<TooltipAnchor className="absolute top-2 right-2 size-[14px] rounded-full" store={tooltipStore}>
				<Help className="size-[14px]" fill="url(#icon-gradient-tertiary)" />
			</TooltipAnchor>

			<Tooltip
				store={tooltipStore}
				className="max-w-xs rounded-lg border border-white/25 bg-darker p-2 leading-relaxed tracking-tight md:max-w-prose"
			>
				{tooltip}
			</Tooltip>
		</div>
	);
}

type InfoSectionProps = PropsWithChildren<{
	readonly title: string;
	readonly tooltip: string;
	readonly raw?: number;
}>;
