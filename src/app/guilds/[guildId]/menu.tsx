"use client";

import type { GuildInfo } from "@/app/guilds/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";
import { Select, SelectArrow, SelectItem, SelectPopover, useSelectStore } from "@ariakit/react/select";
import { BsSignpostFill } from "@react-icons/all-files/bs/BsSignpostFill";
import { FaPatreon } from "@react-icons/all-files/fa/FaPatreon";
import { FaShapes } from "@react-icons/all-files/fa/FaShapes";
import { FiTrendingUp } from "@react-icons/all-files/fi/FiTrendingUp";
import { IoRocketSharp } from "@react-icons/all-files/io5/IoRocketSharp";
import { IoWarning } from "@react-icons/all-files/io5/IoWarning";
import { MdEmojiEmotions } from "@react-icons/all-files/md/MdEmojiEmotions";
import { MdFormatListBulletedAdd } from "@react-icons/all-files/md/MdFormatListBulletedAdd";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import { MdMenuOpen } from "@react-icons/all-files/md/MdMenuOpen";
import { MdSettings } from "@react-icons/all-files/md/MdSettings";
import { TbRobot } from "@react-icons/all-files/tb/TbRobot";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect, useState } from "react";
import type { GuildMetadataResult } from "./layout.tsx";

export function Menu({ guild, guilds }: MenuProps) {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const select = useSelectStore({
		defaultValue: guild.id,
	});
	const selectedGuildValue = select.useState("value");
	const router = useRouter();

	const selectedGuild = guilds.find((guild) => guild.id === selectedGuildValue) ?? guild;

	const currentDashSection = (pathname.split("/")[3] ?? "overview") as Section;

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intended.
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intended.
	useEffect(() => {
		if (selectedGuildValue === guild.id) return;
		router.push(`/guilds/${selectedGuildValue}`);
	}, [selectedGuildValue]);

	return (
		<>
			<button
				className="absolute left-6 top-3 z-[10002] md:hidden"
				onClick={() => setOpen((state) => !state)}
				type="button"
			>
				{open ? <MdMenuOpen size={24} /> : <MdMenu size={24} />}
			</button>

			<div
				className="fixed bottom-0 inset-x-0 top-16 z-[10001] flex flex-col items-center gap-6 bg-background py-4 pl-12 pr-8 data-[open=false]:hidden md:static md:bg-transparent md:py-0 md:data-[open=false]:flex"
				data-open={`${open}`}
			>
				<Select
					store={select}
					className="bg-dark-gray px-3 py-2 rounded-lg flex justify-between items-center w-full shadow-inner max-w-[16.5rem]"
				>
					<div className="flex gap-2 items-center rounded-lg">
						<ImageWithFallback
							alt={`${selectedGuild.name}'s icon`}
							src={guildIcon(selectedGuild.id, selectedGuild.icon)}
							width={32}
							height={32}
							className="rounded-lg"
							fallback={fallbackAvatarImg}
						/>

						<p className="line-clamp-1">{selectedGuild.name}</p>
					</div>

					<SelectArrow />
				</Select>

				<SelectPopover
					store={select}
					gutter={8}
					sameWidth
					className="max-h-96 z-50 rounded-lg bg-dark-gray flex flex-col gap-4 overflow-y-scroll px-2 py-1.5 max-w-[16.5rem]"
				>
					{guilds.map((guild) => (
						<SelectItem
							key={guild.id}
							store={select}
							value={guild.id}
							className="px-1 py-0.5 flex gap-2 items-center rounded-lg hover:bg-white/10 cursor-pointer"
						>
							<ImageWithFallback
								alt={`${guild.name}'s icon`}
								src={guildIcon(guild.id, guild.icon)}
								width={32}
								height={32}
								className="rounded-lg"
								fallback={fallbackAvatarImg}
								unoptimized={Boolean(guild.icon)}
							/>

							<p className="line-clamp-1">{guild.name}</p>
						</SelectItem>
					))}
				</SelectPopover>

				<div>
					<a
						className="relative flex w-fit rounded-lg px-3 py-2 before:absolute before:inset-1 before:rounded-lg before:bg-patreon before:blur-lg after:absolute after:inset-0 after:z-10 after:rounded-lg after:bg-patreon"
						href="https://patreon.com/lurkrbot"
						rel="external noopener noreferrer"
						target="_blank"
					>
						<span className="z-20 flex items-center justify-center gap-3 text-xl font-extrabold text-black">
							<FaPatreon size={24} />
							{guild.premium ? "Perks Active" : "Get Premium"}
						</span>
					</a>

					<aside className="mt-6 mb-2">
						<ul className="flex flex-col whitespace-nowrap gap-1">
							<MenuItem guildId={guild.id} name="Overview" path="" isActive={currentDashSection === "overview"}>
								<MdSettings color="#e2e2e2" size={19} />
							</MenuItem>
							<MenuItem guildId={guild.id} name="Import Bots" path="import" isActive={currentDashSection === "import"}>
								<TbRobot color="#e2e2e2" size={19} />
							</MenuItem>
							<MenuItem guildId={guild.id} name="Leveling" path="leveling" isActive={currentDashSection === "leveling"}>
								<FiTrendingUp color="#ff7077" size={19} />
							</MenuItem>
							<MenuItem
								guildId={guild.id}
								name="Multipliers"
								path="multipliers"
								isActive={currentDashSection === "multipliers"}
							>
								<IoRocketSharp color="#82cbff" size={19} />
							</MenuItem>
							<MenuItem
								guildId={guild.id}
								name="Role Management"
								path="roles"
								isActive={currentDashSection === "roles"}
							>
								<MdFormatListBulletedAdd color="#d2ffae" size={19} />
							</MenuItem>
							<MenuItem
								guildId={guild.id}
								name="Milestones"
								path="milestones"
								isActive={currentDashSection === "milestones"}
							>
								<BsSignpostFill color="#804994" size={19} />
							</MenuItem>
							<MenuItem guildId={guild.id} name="Emoji List" path="emojis" isActive={currentDashSection === "emojis"}>
								<MdEmojiEmotions color="#ffe87c" size={19} />
							</MenuItem>
							<MenuItem
								guildId={guild.id}
								name="Miscellaneous"
								path="miscellaneous"
								isActive={currentDashSection === "miscellaneous"}
							>
								<FaShapes color="#73ffc4" size={19} />
							</MenuItem>
							<MenuItem guildId={guild.id} name="Danger Zone" path="danger" isActive={currentDashSection === "danger"}>
								<IoWarning color="#ff9254" size={19} />
							</MenuItem>
						</ul>
					</aside>
				</div>
			</div>
		</>
	);
}

function MenuItem({ guildId, name, path, isActive, children }: MenuItemProps) {
	return (
		<li>
			<Link
				className={clsx(
					"flex items-center gap-7 rounded-xl py-2 pl-3 pr-5 transition-colors hover:bg-white/10",
					isActive && "bg-white/10",
				)}
				href={`/guilds/${guildId}/${path}`}
				type="button"
			>
				<div className="h-fit w-fit rounded-xl bg-darker p-2">{children}</div>

				<span className={clsx("font-semibold", path === "danger" && "text-red")}>{name}</span>
			</Link>
		</li>
	);
}

export interface MenuGuildData {
	guild: Guild;
	settings: GuildSettings;
}

type MenuItemProps = PropsWithChildren<{
	readonly guildId: string;
	readonly name: string;
	readonly path: Exclude<Section, "overview"> | "";
	readonly isActive: boolean;
}>;

type Section =
	| "danger"
	| "emojis"
	| "import"
	| "leveling"
	| "milestones"
	| "miscellaneous"
	| "multipliers"
	| "roles"
	| "overview";

interface MenuProps {
	readonly guild: GuildMetadataResult;
	readonly guilds: GuildInfo[];
}
