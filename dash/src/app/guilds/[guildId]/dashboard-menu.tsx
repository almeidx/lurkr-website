"use client";

import { Menu, MenuButton, MenuButtonArrow, MenuItem, MenuProvider } from "@ariakit/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import type { GuildInfo } from "@/app/guilds/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { EmojiEmotions } from "@/components/icons/mdi/emoji-emotions.tsx";
import { FormatListBulleted } from "@/components/icons/mdi/format-list-bulleted.tsx";
import { MiscellaneousServices } from "@/components/icons/mdi/miscellaneous-services.tsx";
import { RocketLaunch } from "@/components/icons/mdi/rocket-launch.tsx";
import { Settings } from "@/components/icons/mdi/settings.tsx";
import { Signpost } from "@/components/icons/mdi/signpost.tsx";
import { SmartToy } from "@/components/icons/mdi/smart-toy.tsx";
import { TrendingUp } from "@/components/icons/mdi/trending-up.tsx";
import { Warning } from "@/components/icons/mdi/warning.tsx";
import { Patreon } from "@/components/icons/Patreon.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";
import type { GuildMetadataResult } from "./layout.tsx";

export function DashboardMenu({ guild, guilds }: DashboardMenuProps) {
	const pathname = usePathname()!;

	const currentDashSection = (pathname.split("/")[3] ?? "overview") as Section;

	return (
		<div className="flex flex-col items-center gap-6 bg-transparent py-0 pr-8 pl-12 md:sticky md:top-12">
			<MenuProvider>
				<MenuButton className="flex w-full max-w-66 items-center justify-between rounded-lg bg-dark-gray px-3 py-2 shadow-inner">
					<div className="flex items-center gap-2 rounded-lg">
						<ImageWithFallback
							alt={`${guild.name}'s icon`}
							className="size-7 rounded-lg"
							fallback={fallbackAvatarImg}
							height={28}
							src={guildIcon(guild.id, guild.icon)}
							unoptimized={Boolean(guild.icon)}
							width={28}
						/>

						<p className="line-clamp-1">{guild.name}</p>
					</div>

					<MenuButtonArrow />
				</MenuButton>

				<Menu className="z-50 flex max-h-96 flex-col overflow-y-auto rounded-lg bg-dark-gray" gutter={8} sameWidth>
					{guilds.map((guild) => (
						<MenuItem key={guild.id}>
							<Link
								className="flex cursor-pointer items-center gap-2 px-1.5 py-2 hover:bg-white/10"
								href={`/guilds/${guild.id}`}
								prefetch={guilds.length < 3}
							>
								<ImageWithFallback
									alt={`${guild.name}'s icon`}
									className="rounded-lg"
									fallback={fallbackAvatarImg}
									height={32}
									src={guildIcon(guild.id, guild.icon)}
									unoptimized={Boolean(guild.icon)}
									width={32}
								/>

								<p className="line-clamp-1">{guild.name}</p>
							</Link>
						</MenuItem>
					))}
				</Menu>
			</MenuProvider>

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
						<Item guildId={guild.id} isActive={currentDashSection === "overview"} name="Overview" path="">
							<Settings className="size-5" />
						</Item>
						<Item guildId={guild.id} isActive={currentDashSection === "leveling"} name="Leveling" path="leveling">
							<TrendingUp className="size-5 text-[#ff7077]" />
						</Item>
						<Item guildId={guild.id} isActive={currentDashSection === "import"} name="Import Bots" path="import">
							<SmartToy className="size-5" />
						</Item>
						<Item
							guildId={guild.id}
							isActive={currentDashSection === "multipliers"}
							name="Multipliers"
							path="multipliers"
						>
							<RocketLaunch className="size-5 text-[#82cbff]" />
						</Item>
						<Item guildId={guild.id} isActive={currentDashSection === "roles"} name="Role Management" path="roles">
							<FormatListBulleted className="size-5 text-[#d2ffae]" />
						</Item>
						<Item guildId={guild.id} isActive={currentDashSection === "milestones"} name="Milestones" path="milestones">
							<Signpost className="size-5 text-[#804994]" />
						</Item>
						<Item guildId={guild.id} isActive={currentDashSection === "emojis"} name="Emoji List" path="emojis">
							<EmojiEmotions className="size-5 text-[#ffe87c]" />
						</Item>
						<Item
							guildId={guild.id}
							isActive={currentDashSection === "miscellaneous"}
							name="Miscellaneous"
							path="miscellaneous"
						>
							<MiscellaneousServices className="size-5 text-[#73ffc4]" />
						</Item>
						<Item guildId={guild.id} isActive={currentDashSection === "danger"} name="Danger Zone" path="danger">
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
