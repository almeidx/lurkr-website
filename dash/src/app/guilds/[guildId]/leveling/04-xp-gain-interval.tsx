"use client";

import {
	Select,
	SelectArrow,
	SelectItem,
	SelectLabel,
	SelectPopover,
	useSelectStore,
	useStoreState,
} from "@ariakit/react";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";

const XP_GAIN_INTERVALS = [
	{ label: "10 seconds", value: 10 * 1000 },
	{ label: "15 seconds", value: 15 * 1000 },
	{ label: "30 seconds", value: 30 * 1000 },
	{ label: "45 seconds", value: 45 * 1000 },
	{ label: "1 minute", value: 60 * 1000 },
	{ label: "1.5 minutes", value: 90 * 1000 },
	{ label: "2 minutes", value: 2 * 60 * 1000 },
	{ label: "3 minutes", value: 3 * 60 * 1000 },
	{ label: "5 minutes", value: 5 * 60 * 1000 },
	{ label: "7 minutes", value: 7 * 60 * 1000 },
	{ label: "10 minutes", value: 10 * 60 * 1000 },
	{ label: "15 minutes", value: 15 * 60 * 1000 },
	{ label: "30 minutes", value: 30 * 60 * 1000 },
	{ label: "1 hour", value: 60 * 60 * 1000 },
	{ label: "3 hours", value: 3 * 60 * 60 * 1000 },
	{ label: "6 hours", value: 6 * 60 * 60 * 1000 },
	{ label: "12 hours", value: 12 * 60 * 60 * 1000 },
	{ label: "24 hours", value: 24 * 60 * 60 * 1000 },
] as const;

export function XpGainInterval({ defaultValue }: { readonly defaultValue: number }) {
	const select = useSelectStore({ defaultValue: defaultValue.toString() });
	const value = useStoreState(select, "value");

	const selectedInterval = XP_GAIN_INTERVALS.find((interval) => interval.value.toString() === value);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center">
				<SelectLabel className="text-lg text-white/75 tracking-tight md:text-xl" store={select}>
					Choose how long users must wait between XP-earning messages…
				</SelectLabel>

				<DocsBubble
					path="/guides/leveling-automation#xp-gain-cooldown"
					tooltip="This prevents users from spamming messages to gain XP quickly. Only messages sent after this cooldown period will count towards XP gain."
				/>
			</div>

			<Select
				className="flex h-10 w-48 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				name="xpGainInterval"
				store={select}
			>
				{selectedInterval ? (
					<span className="font-medium text-white">{selectedInterval.label}</span>
				) : (
					"Select cooldown time"
				)}

				<SelectArrow />
			</Select>

			<SelectPopover
				className="z-10000 flex max-h-64 w-48 flex-col gap-2 overflow-y-auto rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				gutter={8}
				sameWidth
				store={select}
			>
				{XP_GAIN_INTERVALS.map(({ value, label }) => (
					<SelectItem
						className="flex cursor-default items-center rounded-lg p-2 text-lg text-white/75 tracking-tight hover:bg-white/5 data-active-item:bg-white/10 data-active-item:text-white"
						key={value}
						store={select}
						value={value.toString()}
					>
						<span className="font-medium text-white">{label}</span>
					</SelectItem>
				))}
			</SelectPopover>
		</div>
	);
}
