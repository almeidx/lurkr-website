"use client";

import { FieldError, Label, ListBox, Select } from "@heroui/react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useState } from "react";
import amariIcon from "@/assets/bots/amari.webp";
import mee6Icon from "@/assets/bots/mee6.svg";
import polarisIcon from "@/assets/bots/polaris.svg";
import { LevelingImportBot } from "@/lib/guild.ts";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.ts";

interface BotEntry {
	icon: StaticImport;
	name: LevelingImportBot;
	disabled?: boolean;
	disabledReason?: string;
}

const bots: BotEntry[] = [
	{ icon: mee6Icon, name: LevelingImportBot.Mee6 },
	{ disabled: true, disabledReason: "Amari's API has been taken down", icon: amariIcon, name: LevelingImportBot.Amari },
	{
		disabled: true,
		disabledReason: "Polaris' API has been retired",
		icon: polarisIcon,
		name: LevelingImportBot.Polaris,
	},
];

export function BotSelector() {
	const [selectedBot, setSelectedBot] = useState<LevelingImportBot | null>(null);

	return (
		<div className="flex flex-col gap-2 rounded-lg">
			<Select
				className="gap-2"
				isRequired
				name="bot"
				onChange={(key) => setSelectedBot(key as LevelingImportBot | null)}
				placeholder="Select your current bot"
				value={selectedBot}
			>
				<Label className="text-lg font-normal tracking-tight text-white/75 after:content-none md:text-xl">
					Select your current bot:{" "}
				</Label>

				<Select.Trigger className="h-10 w-56 items-center rounded-lg border-0 bg-light-gray shadow-dim-inner">
					<Select.Value className="flex items-center gap-2 text-base sm:text-base" />
					<Select.Indicator />
				</Select.Trigger>

				<FieldError />

				<Select.Popover className="w-(--trigger-width) rounded-lg bg-light-gray shadow-dim-inner">
					<ListBox>
						{bots.map(({ name, icon, disabled, disabledReason }) => (
							<ListBox.Item
								className="gap-2 rounded-lg text-lg tracking-tight text-white/75 data-focus-visible:text-white data-hovered:text-white"
								id={name}
								isDisabled={disabled}
								key={name}
								textValue={name}
							>
								<Image alt={`${name} icon`} className="size-5 rounded-full" height={20} src={icon} width={20} />
								<span className="flex flex-col">
									<span>{name}</span>
									{disabledReason && <span className="text-xs text-white/40">{disabledReason}</span>}
								</span>
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			{selectedBot === null ? (
				<p className="text-sm text-white/40">
					For Polaris imports, you can request a manual import with your JSON data in our{" "}
					<a className="text-blue underline" href={SUPPORT_SERVER_INVITE} rel="noopener noreferrer" target="_blank">
						support server
					</a>
					.
				</p>
			) : null}
		</div>
	);
}
