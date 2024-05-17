"use client";

import type { GuildInfo } from "@/app/guilds/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { Patreon } from "@/components/icons/Patreon.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";
import { Menu, MenuButton, MenuButtonArrow, MenuItem, useMenuStore } from "@ariakit/react/menu";
import {
	EmojiEmotions,
	FormatListBulleted,
	MiscellaneousServices,
	RocketLaunch,
	Settings,
	Signpost,
	TrendingUp,
	Warning,
} from "@mui/icons-material";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import type { GuildMetadataResult } from "./layout.tsx";

export function DashboardMenu({ guild, guilds }: DashboardMenuProps) {
	const menu = useMenuStore();
	const pathname = usePathname()!;

	const currentDashSection = (pathname.split("/")[3] ?? "overview") as Section;

	return (
		<div className="flex flex-col items-center gap-6 pl-12 pr-8 md:sticky md:top-12 bg-transparent py-0">
			<MenuButton
				store={menu}
				className="bg-dark-gray px-3 py-2 rounded-lg flex justify-between items-center w-full shadow-inner max-w-[16.5rem]"
			>
				<div className="flex gap-2 items-center rounded-lg">
					<ImageWithFallback
						alt={`${guild.name}'s icon`}
						src={guildIcon(guild.id, guild.icon)}
						width={28}
						height={28}
						className="rounded-lg size-7"
						fallback={fallbackAvatarImg}
						unoptimized={Boolean(guild.icon)}
					/>

					<p className="line-clamp-1">{guild.name}</p>
				</div>

				<MenuButtonArrow />
			</MenuButton>

			<Menu
				store={menu}
				gutter={8}
				sameWidth
				className="max-h-96 z-50 rounded-lg bg-dark-gray flex flex-col overflow-y-auto"
			>
				{guilds.map((guild) => (
					<MenuItem key={guild.id} store={menu}>
						<Link
							className="flex gap-2 items-center py-2 px-1.5 cursor-pointer hover:bg-white/10"
							href={`/guilds/${guild.id}`}
							prefetch={guilds.length < 3}
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
						</Link>
					</MenuItem>
				))}
			</Menu>

			<div>
				<Link
					className="relative flex w-fit rounded-lg px-3 py-2 before:absolute before:inset-1 before:rounded-lg before:bg-patreon before:blur-lg after:absolute after:inset-0 after:z-10 after:rounded-lg after:bg-patreon"
					href="/premium"
				>
					<span className="z-20 flex items-center justify-center gap-3 text-xl font-extrabold text-black">
						<Patreon className="size-6" />
						{guild.premium ? "Perks Active" : "Get Premium"}
					</span>
				</Link>

				<aside className="mt-6 mb-2">
					<ul className="flex flex-col whitespace-nowrap gap-1">
						<Item guildId={guild.id} name="Overview" path="" isActive={currentDashSection === "overview"}>
							<Settings className="size-5" />
						</Item>
						{/* TODO: Re-add this once implemented */}
						{/* <Item guildId={guild.id} name="Import Bots" path="import" isActive={currentDashSection === "import"}>
							<TbRobot className="size-5" />
						</Item> */}
						<Item guildId={guild.id} name="Leveling" path="leveling" isActive={currentDashSection === "leveling"}>
							<TrendingUp className="text-[#ff7077] size-5" />
						</Item>
						<Item
							guildId={guild.id}
							name="Multipliers"
							path="multipliers"
							isActive={currentDashSection === "multipliers"}
						>
							<RocketLaunch className="text-[#82cbff] size-5" />
						</Item>
						<Item guildId={guild.id} name="Role Management" path="roles" isActive={currentDashSection === "roles"}>
							<FormatListBulleted className="text-[#d2ffae] size-5" />
						</Item>
						<Item guildId={guild.id} name="Milestones" path="milestones" isActive={currentDashSection === "milestones"}>
							<Signpost className="text-[#804994] size-5" />
						</Item>
						<Item guildId={guild.id} name="Emoji List" path="emojis" isActive={currentDashSection === "emojis"}>
							<EmojiEmotions className="text-[#ffe87c] size-5" />
						</Item>
						<Item
							guildId={guild.id}
							name="Miscellaneous"
							path="miscellaneous"
							isActive={currentDashSection === "miscellaneous"}
						>
							<MiscellaneousServices className="text-[#73ffc4] size-5" />
						</Item>
						<Item guildId={guild.id} name="Danger Zone" path="danger" isActive={currentDashSection === "danger"}>
							<Warning className="text-[#ff9254] size-5" />
						</Item>
					</ul>
				</aside>
			</div>
		</div>
	);
}

function Item({ guildId, name, path, isActive, children }: ItemProps) {
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
				<div className="size-fit rounded-xl bg-darker p-2">{children}</div>

				<span className={clsx("font-semibold", path === "danger" && "text-red")}>{name}</span>
			</Link>
		</li>
	);
}

export interface MenuGuildData {
	guild: Guild;
	settings: GuildSettings;
}

type ItemProps = PropsWithChildren<{
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

interface DashboardMenuProps {
	readonly guild: GuildMetadataResult;
	readonly guilds: GuildInfo[];
}
