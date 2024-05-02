"use client";

import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";
import type { PropsWithChildren } from "react";

export function CreateMultiplierButton({
	children,
	handleCreateMultiplier,
	maxMultipliers,
	multiplierCount,
	newMultiplier,
	newTargets,
}: CreateMultiplierButtonProps) {
	const tooltip = useTooltipStore({ showTimeout: 50 });

	const btn = (
		<button
			className="rounded-lg bg-green p-1 transition-colors [&:not(:disabled)]:hover:bg-green/75 disabled:cursor-not-allowed"
			onClick={handleCreateMultiplier}
			disabled={multiplierCount >= maxMultipliers || !newTargets.length || !newMultiplier}
			type="button"
		>
			{children}
		</button>
	);

	if (multiplierCount >= maxMultipliers || !newTargets.length || !newMultiplier) {
		return (
			<>
				<TooltipAnchor className="" store={tooltip}>
					{btn}
				</TooltipAnchor>

				<Tooltip
					store={tooltip}
					className="max-w-xs rounded-lg border bg-darker p-2 leading-relaxed tracking-tight md:max-w-prose"
				>
					{multiplierCount >= maxMultipliers
						? "You've reached the maximum number of multipliers."
						: "Please select, at least, one target and enter a multiplier value."}
				</Tooltip>
			</>
		);
	}

	return btn;
}

interface CreateMultiplierButtonProps extends PropsWithChildren {
	readonly handleCreateMultiplier: () => void;
	readonly multiplierCount: number;
	readonly maxMultipliers: number;
	readonly newTargets: readonly unknown[];
	readonly newMultiplier: string;
}
