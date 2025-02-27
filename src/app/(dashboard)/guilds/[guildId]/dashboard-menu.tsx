"use client";

import type { GuildInfo } from "@/app/(dashboard)/guilds/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { Patreon } from "@/components/icons/Patreon.tsx";
import { EmojiEmotions } from "@/components/icons/mdi/emoji-emotions.tsx";
import { FormatListBulleted } from "@/components/icons/mdi/format-list-bulleted.tsx";
import { MiscellaneousServices } from "@/components/icons/mdi/miscellaneous-services.tsx";
import { RocketLaunch } from "@/components/icons/mdi/rocket-launch.tsx";
import { Settings } from "@/components/icons/mdi/settings.tsx";
import { Signpost } from "@/components/icons/mdi/signpost.tsx";
import { SmartToy } from "@/components/icons/mdi/smart-toy.tsx";
import { TrendingUp } from "@/components/icons/mdi/trending-up.tsx";
import { Warning } from "@/components/icons/mdi/warning.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";
import { Menu, MenuButton, MenuButtonArrow, MenuItem, useMenuStore } from "@ariakit/react";
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
		<div className="flex flex-col items-center gap-6 bg-transparent py-0 pr-8 pl-12 md:sticky md:top-12">
			<MenuButton
				store={menu}
				className="flex w-full max-w-[16.5rem] items-center justify-between rounded-lg bg-dark-gray px-3 py-2 shadow-inner"
			>
				<div className="flex items-center gap-2 rounded-lg">
					<ImageWithFallback
						alt={`${guild.name}'s icon`}
						src={guildIcon(guild.id, guild.icon)}
						width={28}
						height={28}
						className="size-7 rounded-lg"
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
				className="z-50 flex max-h-96 flex-col overflow-y-auto rounded-lg bg-dark-gray"
			>
				{guilds.map((guild) => (
					<MenuItem key={guild.id} store={menu}>
						<Link
							className="flex cursor-pointer items-center gap-2 px-1.5 py-2 hover:bg-white/10"
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
					className={clsx(
						"relative flex w-full rounded-lg px-3 py-2 font-bold",
						guild.premium
							? "border border-white text-white"
							: "text-black before:absolute before:inset-1 before:rounded-lg before:bg-linear-(--patreon-gradient) before:blur-lg after:absolute after:inset-0 after:z-10 after:rounded-lg after:bg-linear-(--patreon-gradient)",
					)}
					href="/premium"
					prefetch={false}
				>
					<span className="z-20 flex items-center justify-center gap-3 text-xl">
						<Patreon className="size-6" />
						{guild.premium ? "Perks Active" : "Get Premium"}
					</span>
				</Link>

				<aside className="mt-6 mb-2">
					<ul className="flex flex-col gap-1 whitespace-nowrap">
						<Item guildId={guild.id} name="Overview" path="" isActive={currentDashSection === "overview"}>
							<Settings className="size-5" />
						</Item>
						<Item guildId={guild.id} name="Leveling" path="leveling" isActive={currentDashSection === "leveling"}>
							<TrendingUp className="size-5 text-[#ff7077]" />
						</Item>
						<Item guildId={guild.id} name="Import Bots" path="import" isActive={currentDashSection === "import"}>
							<SmartToy className="size-5" />
						</Item>
						<Item
							guildId={guild.id}
							name="Multipliers"
							path="multipliers"
							isActive={currentDashSection === "multipliers"}
						>
							<RocketLaunch className="size-5 text-[#82cbff]" />
						</Item>
						<Item guildId={guild.id} name="Role Management" path="roles" isActive={currentDashSection === "roles"}>
							<FormatListBulleted className="size-5 text-[#d2ffae]" />
						</Item>
						<Item guildId={guild.id} name="Milestones" path="milestones" isActive={currentDashSection === "milestones"}>
							<Signpost className="size-5 text-[#804994]" />
						</Item>
						<Item guildId={guild.id} name="Emoji List" path="emojis" isActive={currentDashSection === "emojis"}>
							<EmojiEmotions className="size-5 text-[#ffe87c]" />
						</Item>
						<Item
							guildId={guild.id}
							name="Miscellaneous"
							path="miscellaneous"
							isActive={currentDashSection === "miscellaneous"}
						>
							<MiscellaneousServices className="size-5 text-[#73ffc4]" />
						</Item>
						<Item guildId={guild.id} name="Danger Zone" path="danger" isActive={currentDashSection === "danger"}>
							<Warning className="size-5 text-[#ff9254]" />
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
					"flex items-center gap-7 rounded-xl py-2 pr-5 pl-3 transition-colors hover:bg-white/10",
					isActive && "bg-white/10",
				)}
				href={`/guilds/${guildId}/${path}`}
				type="button"
			>
				<div className="flex size-9 items-center justify-center rounded-xl bg-darker">{children}</div>

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
