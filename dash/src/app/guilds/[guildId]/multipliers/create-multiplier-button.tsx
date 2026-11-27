import { Tooltip } from "@heroui/react";
import { type PropsWithChildren, useState } from "react";

export function CreateMultiplierButton({
	children,
	handleCreateMultiplier,
	maxMultipliers,
	multiplierCount,
	newMultiplier,
	newTargets,
	existingMultiplierValues,
}: CreateMultiplierButtonProps) {
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	const multiplierIsInUse = existingMultiplierValues.includes(Number.parseFloat(newMultiplier));
	const isButtonDisabled =
		multiplierCount >= maxMultipliers || !newTargets.length || !newMultiplier || multiplierIsInUse;

	const btn = (
		<button
			className="rounded-lg bg-green p-1 transition-colors not-disabled:hover:bg-green/75 disabled:opacity-50"
			disabled={isButtonDisabled}
			onClick={handleCreateMultiplier}
			type="button"
		>
			{children}
		</button>
	);

	if (isButtonDisabled) {
		return (
			<Tooltip isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
				<Tooltip.Trigger onBlur={() => setIsTooltipOpen(false)} onFocus={() => setIsTooltipOpen(true)}>
					{btn}
				</Tooltip.Trigger>

				<Tooltip.Content className="max-w-xs rounded-lg border bg-darker p-2 text-base leading-relaxed tracking-tight break-normal md:max-w-prose">
					{multiplierCount >= maxMultipliers
						? "You've reached the maximum number of multipliers."
						: multiplierIsInUse
							? "This multiplier value is already in use."
							: "Please select, at least, one target and enter a multiplier value."}
				</Tooltip.Content>
			</Tooltip>
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
