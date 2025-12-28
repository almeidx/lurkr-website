"use client";

import { CircleQuestionFill } from "@gravity-ui/icons";
import { type Input, InputGroup, Label, TextField } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip.tsx";

export function CalculatorInput({
	label,
	tooltip,
	onValueChange,
	className,
	startContent,
	...props
}: CalculatorInputProps) {
	return (
		<TextField className={className} type="number">
			<Label className="flex items-center gap-1.5 text-small text-zinc-400">
				{label}
				{tooltip && (
					<ResponsiveTooltip content={<div className="max-w-xs text-center">{tooltip}</div>} delay={100}>
						<div className="cursor-help transition-colors hover:text-white">
							<CircleQuestionFill className="size-3.5 fill-current" />
						</div>
					</ResponsiveTooltip>
				)}
			</Label>

			<InputGroup>
				<InputGroup.Prefix>{startContent}</InputGroup.Prefix>
				<InputGroup.Input onChange={(e) => onValueChange(e.target.value)} {...props} />
			</InputGroup>
		</TextField>
	);
}

interface CalculatorInputProps extends Omit<ComponentProps<typeof Input>, "className" | "onChange"> {
	label: string;
	tooltip?: string;
	onValueChange: (value: string) => void;
	className?: string;
	startContent?: ReactNode;
}
