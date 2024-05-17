"use client";

import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";
import { Help } from "@mui/icons-material";
import type { PropsWithChildren } from "react";

export function InfoSection({ children, title, tooltip }: InfoSectionProps) {
	const tooltipStore = useTooltipStore({ showTimeout: 150 });

	return (
		<div className="relative flex h-24 w-64 flex-col items-center justify-between rounded-lg border bg-dark-gray py-2">
			<h2 className="text-center text-xl tracking-tighter text-white/75">{title}</h2>
			<p className="text-4xl font-bold">{children}</p>

			<TooltipAnchor className="absolute right-2 top-2 size-[14px] rounded-full" store={tooltipStore}>
				<Help className="fill-icon-gradient-tertiary size-[14px]" />
			</TooltipAnchor>

			<Tooltip
				store={tooltipStore}
				className="max-w-xs rounded-lg border bg-darker p-2 leading-relaxed tracking-tight md:max-w-prose"
			>
				{tooltip}
			</Tooltip>
		</div>
	);
}

type InfoSectionProps = PropsWithChildren<{
	readonly title: string;
	readonly tooltip: string;
}>;
