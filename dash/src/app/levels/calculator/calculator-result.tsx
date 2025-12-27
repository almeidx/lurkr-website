"use client";

import { Tooltip } from "@heroui/react";
import { Help } from "@/components/icons/mdi/help.tsx";

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
		<div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
			<div className="mb-2 flex items-center gap-2 text-tiny text-zinc-400 uppercase tracking-wider">
				{label}
				<Tooltip delay={0}>
					<Tooltip.Trigger className="cursor-help fill-zinc-400 transition-colors hover:fill-white">
						<Help className="size-3.5" />
					</Tooltip.Trigger>
					<Tooltip.Content className="max-w-xs rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-center text-tiny text-white shadow-xl">
						{tooltip}
					</Tooltip.Content>
				</Tooltip>
			</div>
			<div className="font-semibold text-2xl text-white">{value}</div>
		</div>
	);
}
