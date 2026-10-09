"use client";

import {
	ComboboxItem,
	ComboboxPopover,
	ComboboxSelect,
	ComboboxSelectArrow,
	ComboboxSelectLabel,
	useComboboxStore,
	useStoreState,
} from "@ariakit/react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
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
	const combobox = useComboboxStore({ defaultSelectedValue: "" });
	const selectedValue = useStoreState(combobox, "selectedValue");

	const selectedBot = bots.find((bot) => bot.name === selectedValue);

	return (
		<div className="flex flex-col gap-2 rounded-lg">
			<ComboboxSelectLabel className="text-lg tracking-tight text-white/75 md:text-xl" store={combobox}>
				Select your current bot:{" "}
			</ComboboxSelectLabel>

			<ComboboxSelect
				className="flex h-10 w-56 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				id="bot"
				name="bot"
				required
				store={combobox}
			>
				{selectedBot ? (
					<div className="flex items-center gap-2">
						<Image
							alt={`${selectedBot.name} icon`}
							className="size-5 rounded-full"
							height={20}
							src={selectedBot.icon}
							width={20}
						/>
						{selectedBot.name}
					</div>
				) : (
					"Select your current bot"
				)}

				<ComboboxSelectArrow />
			</ComboboxSelect>

			<ComboboxPopover
				className="z-10000 flex w-40 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-56"
				gutter={8}
				sameWidth
				store={combobox}
			>
				<ComboboxItem
					className="flex cursor-pointer items-center gap-2 text-lg tracking-tight text-white/75 hover:text-white"
					disabled
					hidden
					key="none"
					store={combobox}
					value=""
				>
					Select your current bot
				</ComboboxItem>

				{bots.map(({ name, icon, disabled, disabledReason }) => (
					<ComboboxItem
						className="flex cursor-default items-center gap-2 text-lg tracking-tight text-white/75 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-active-item:text-white"
						disabled={disabled}
						key={name}
						store={combobox}
						value={name}
					>
						<Image alt={`${name} icon`} className="size-5 rounded-full" height={20} src={icon} width={20} />
						<span className="flex flex-col">
							<span>{name}</span>
							{disabledReason && <span className="text-xs text-white/40">{disabledReason}</span>}
						</span>
					</ComboboxItem>
				))}
			</ComboboxPopover>

			{selectedValue === "" ? (
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
