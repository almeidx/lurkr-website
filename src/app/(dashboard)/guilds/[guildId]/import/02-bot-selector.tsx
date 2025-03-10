"use client";

import amariIcon from "@/assets/bots/amari.webp";
import mee6Icon from "@/assets/bots/mee6.svg";
import polarisIcon from "@/assets/bots/polaris.svg";
import { LevelingImportBot } from "@/lib/guild.ts";
import {
	Select,
	SelectArrow,
	SelectItem,
	SelectLabel,
	SelectPopover,
	useSelectStore,
	useStoreState,
} from "@ariakit/react";
import Image from "next/image";

const bots = [
	{ name: LevelingImportBot.Mee6, icon: mee6Icon },
	{ name: LevelingImportBot.Amari, icon: amariIcon },
	{ name: LevelingImportBot.Polaris, icon: polarisIcon },
] as const;

export function BotSelector() {
	const select = useSelectStore({ defaultValue: "" });
	const value = useStoreState(select, "value");

	const selectedBot = bots.find((bot) => bot.name === value);

	return (
		<div className="flex flex-col gap-2 rounded-lg">
			<SelectLabel className="text-lg text-white/75 tracking-tight md:text-xl" store={select}>
				Select your current bot:{" "}
			</SelectLabel>

			<Select
				store={select}
				className="flex h-10 w-56 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				id="bot"
				name="bot"
				required
			>
				{selectedBot ? (
					<div className="flex items-center gap-2">
						<Image
							src={selectedBot.icon}
							alt={`${selectedBot.name} icon`}
							width={20}
							height={20}
							className="size-5 rounded-full"
						/>
						{selectedBot.name}
					</div>
				) : (
					"Select your current bot"
				)}

				<SelectArrow />
			</Select>

			<SelectPopover
				store={select}
				gutter={8}
				sameWidth
				className="z-10000 flex w-40 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-56"
			>
				<SelectItem
					key="none"
					className="flex cursor-pointer items-center gap-2 text-lg text-white/75 tracking-tight hover:text-white"
					store={select}
					value=""
					disabled
					hidden
				>
					Select your current bot
				</SelectItem>

				{bots.map(({ name, icon }) => (
					<SelectItem
						key={name}
						className="flex cursor-default items-center gap-2 text-lg text-white/75 tracking-tight data-active-item:text-white"
						store={select}
						value={name}
					>
						<Image src={icon} alt={`${name} icon`} width={20} height={20} className="size-5 rounded-full" />
						{name}
					</SelectItem>
				))}
			</SelectPopover>
		</div>
	);
}
