import "client-only";
// The reason for using "client-only" instead of "use client" is because of the function parameter in the component,
// which triggers a warning since functions are not serializable.

import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react";
import type { PropsWithChildren } from "react";

export function CreateMultiplierButton({
	children,
	handleCreateMultiplier,
	maxMultipliers,
	multiplierCount,
	newMultiplier,
	newTargets,
	existingMultiplierValues,
}: CreateMultiplierButtonProps) {
	const tooltip = useTooltipStore({ showTimeout: 50 });

	const multiplierIsInUse = existingMultiplierValues.includes(Number.parseFloat(newMultiplier));
	const isButtonDisabled =
		multiplierCount >= maxMultipliers || !newTargets.length || !newMultiplier || multiplierIsInUse;

	const btn = (
		<button
			className="rounded-lg bg-green p-1 transition-colors not-disabled:hover:bg-green/75 disabled:cursor-not-allowed disabled:opacity-50"
			onClick={handleCreateMultiplier}
			disabled={isButtonDisabled}
			type="button"
		>
			{children}
		</button>
	);

	if (isButtonDisabled) {
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
						: multiplierIsInUse
							? "This multiplier value is already in use."
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
	readonly existingMultiplierValues: readonly number[];
}
