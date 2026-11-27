"use client";

import { Label, ListBox, Select } from "@heroui/react";
import { useState } from "react";
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
	return (
		// `key` is required here to prevent rollback to previous setting after saving
		<XpGainIntervalSelect initialValue={defaultValue.toString()} key={defaultValue} />
	);
}

function XpGainIntervalSelect({ initialValue }: { readonly initialValue: string }) {
	const [value, setValue] = useState(initialValue);

	return (
		<Select
			className="gap-2"
			onChange={(key) => {
				if (key) setValue(key.toString());
			}}
			placeholder="Select cooldown time"
			value={value}
		>
			{/* Submitted from here, as the form reset that follows a save empties the select element of `Select` */}
			<input name="xpGainInterval" type="hidden" value={value} />

			<div className="flex items-center">
				<Label className="text-lg font-normal tracking-tight text-white/75 md:text-xl">
					Choose how long users must wait between XP-earning messages…
				</Label>

				<DocsBubble
					path="/guides/leveling-automation#xp-gain-cooldown"
					tooltip="This prevents users from spamming messages to gain XP quickly. Only messages sent after this cooldown period will count towards XP gain."
				/>
			</div>

			<Select.Trigger className="h-10 w-48 items-center rounded-lg border-0 bg-light-gray shadow-dim-inner">
				<Select.Value className="text-base font-medium text-white sm:text-base" />
				<Select.Indicator />
			</Select.Trigger>

			<Select.Popover className="rounded-lg bg-light-gray shadow-dim-inner" maxHeight={256}>
				<ListBox>
					{XP_GAIN_INTERVALS.map(({ value, label }) => (
						<ListBox.Item
							className="rounded-lg text-lg font-medium tracking-tight text-white data-focus-visible:bg-white/10 data-hovered:bg-white/5"
							id={value.toString()}
							key={value}
							textValue={label}
						>
							{label}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	);
}
