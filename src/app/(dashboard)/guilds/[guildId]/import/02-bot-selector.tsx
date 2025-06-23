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
import Image from "next/image";
import amariIcon from "@/assets/bots/amari.webp";
import mee6Icon from "@/assets/bots/mee6.svg";
import polarisIcon from "@/assets/bots/polaris.svg";
import { LevelingImportBot } from "@/lib/guild.ts";

const bots = [
	{ icon: mee6Icon, name: LevelingImportBot.Mee6 },
	{ icon: amariIcon, name: LevelingImportBot.Amari },
	{ icon: polarisIcon, name: LevelingImportBot.Polaris },
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
				className="flex h-10 w-56 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				id="bot"
				name="bot"
				required
				store={select}
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

				<SelectArrow />
			</Select>

			<SelectPopover
				className="z-10000 flex w-40 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-56"
				gutter={8}
				sameWidth
				store={select}
			>
				<SelectItem
					className="flex cursor-pointer items-center gap-2 text-lg text-white/75 tracking-tight hover:text-white"
					disabled
					hidden
					key="none"
					store={select}
					value=""
				>
					Select your current bot
				</SelectItem>

				{bots.map(({ name, icon }) => (
					<SelectItem
						className="flex cursor-default items-center gap-2 text-lg text-white/75 tracking-tight data-active-item:text-white"
						key={name}
						store={select}
						value={name}
					>
						<Image alt={`${name} icon`} className="size-5 rounded-full" height={20} src={icon} width={20} />
						{name}
					</SelectItem>
				))}
			</SelectPopover>
		</div>
	);
}
