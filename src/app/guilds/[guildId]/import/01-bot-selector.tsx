"use client";

import amariIcon from "@/assets/bots/amari.png";
import mee6Icon from "@/assets/bots/mee6.svg";
import { Select, SelectArrow, SelectItem, SelectLabel, SelectPopover, useSelectStore } from "@ariakit/react/select";
import Image from "next/image";

const bots = [
	{ name: "MEE6", icon: mee6Icon },
	{ name: "Amari", icon: amariIcon },
] as const;

export function BotSelector() {
	const select = useSelectStore();
	const value = select.useState("value");

	const selectedBot = bots.find((bot) => bot.name === value);

	return (
		<div className="flex h-6 items-center gap-2 rounded-lg">
			<SelectLabel className="text-lg text-white/75 tracking-tight md:text-xl" store={select}>
				Select your current bot:{" "}
			</SelectLabel>

			<Select
				store={select}
				className="flex h-10 w-56 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				id="bot"
				name="bot"
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
				className="z-[10000] flex w-40 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-56"
			>
				{bots.map(({ name, icon }) => (
					<SelectItem
						key={name}
						className="flex cursor-pointer items-center gap-2 text-lg text-white/75 tracking-tight hover:text-white md:text-xl"
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
