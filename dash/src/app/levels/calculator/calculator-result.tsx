"use client";

import { CircleQuestionFill } from "@gravity-ui/icons";
import { Surface } from "@heroui/react";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip.tsx";

export function CalculatorResult({
	label,
	tooltip,
	value,
}: {
	label: string;
	tooltip: string;
	value: string | number;
}) {
	return (
		<Surface className="rounded-3xl p-6">
			<div className="mb-2 flex items-center gap-2 text-zinc-400 uppercase tracking-wider">
				{label}
				<ResponsiveTooltip content={<div className="max-w-xs text-center">{tooltip}</div>} delay={100}>
					<div className="cursor-help transition-colors hover:text-white">
						<CircleQuestionFill className="size-3.5 fill-current" />
					</div>
				</ResponsiveTooltip>
			</div>
			<div className="font-semibold text-2xl text-white">{value}</div>
		</Surface>
	);
}
