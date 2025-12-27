"use client";

import { Input, Label, TextField, Tooltip } from "@heroui/react";
import { Help } from "@/components/icons/mdi/help.tsx";

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
					<Tooltip delay={0}>
						<Tooltip.Trigger className="cursor-help fill-zinc-400 transition-colors hover:fill-white">
							<Help className="size-3.5" />
						</Tooltip.Trigger>
						<Tooltip.Content className="max-w-xs rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-center text-tiny text-white shadow-xl">
							{tooltip}
						</Tooltip.Content>
					</Tooltip>
				)}
			</Label>

			<div className="relative">
				{startContent && (
					<div className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-zinc-400">
						{startContent}
					</div>
				)}
				<Input
					className={`w-full rounded-xl border border-white/10 bg-black/20 py-2 pr-3 text-white transition-colors placeholder:text-white/30 hover:bg-black/30 focus:border-white/20 focus:bg-black/40 focus:outline-hidden ${startContent ? "pl-9" : "px-3"}`}
					onChange={(e) => onValueChange(e.target.value)}
					{...props}
				/>
			</div>
		</TextField>
	);
}

interface CalculatorInputProps extends Omit<React.ComponentProps<typeof Input>, "className"> {
	label: string;
	tooltip?: string;
	onValueChange: (value: string) => void;
	className?: string;
	startContent?: React.ReactNode;
}
