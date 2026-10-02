"use client";

import { CircleQuestionFill } from "@gravity-ui/icons";
import { Surface } from "@heroui/react";
import { ResponsiveTooltip } from "@/components/responsive-tooltip.tsx";

export function CalculatorResult({ label, tooltip, value, title }: CalculatorResultProps) {
	return (
		<Surface className="rounded-3xl p-6">
			<div className="mb-2 flex items-center gap-2 tracking-wider text-zinc-400 uppercase">
				{label}
				<ResponsiveTooltip content={<div className="max-w-xs text-center">{tooltip}</div>} delay={100}>
					<div className="cursor-help transition-colors hover:text-white">
						<CircleQuestionFill className="size-3.5 fill-current" />
					</div>
				</ResponsiveTooltip>
			</div>
			<div className="text-2xl font-semibold text-white" title={title}>
				{value}
			</div>
		</Surface>
	);
}

interface CalculatorResultProps {
	label: string;
	tooltip: string;
	value: string | number;
	title: string;
}
