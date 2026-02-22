"use client";

import { Card, Link as HeroLink } from "@heroui/react";
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
		<aside className="w-72 shrink-0 py-4">
			<div className="flex flex-col gap-3 md:sticky md:top-12">
				<Card className="border border-white/10 bg-darker/90 p-2">
					<Card.Content className="space-y-2 p-0">
						<div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
							<ImageWithFallback
								alt={`${guild.name}'s icon`}
								className="size-8 rounded-md"
								fallback={fallbackAvatarImg}
								height={32}
								src={guildIcon(guild.id, guild.icon)}
								unoptimized={Boolean(guild.icon)}
								width={32}
							/>
							<p className="line-clamp-1 font-semibold text-sm">{guild.name}</p>
						</div>

						<ul className="max-h-52 space-y-1 overflow-y-auto pr-1">
							{guilds.map((availableGuild) => (
								<li key={availableGuild.id}>
									<Link
										className={clsx(
											"flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-white/10",
											availableGuild.id === guild.id && "bg-white/10",
										)}
										href={`/guilds/${availableGuild.id}`}
										prefetch={guilds.length < 3}
									>
										<ImageWithFallback
											alt={`${availableGuild.name}'s icon`}
											className="size-7 rounded-md"
											fallback={fallbackAvatarImg}
											height={28}
											src={guildIcon(availableGuild.id, availableGuild.icon)}
											unoptimized={Boolean(availableGuild.icon)}
											width={28}
										/>
										<p className="line-clamp-1">{availableGuild.name}</p>
									</Link>
								</li>
							))}
						</ul>
					</Card.Content>
				</Card>

				<HeroLink
					className={clsx(
						"relative flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-semibold text-base",
						guild.premium
							? "border border-white/20 text-white hover:bg-white/5"
							: "text-black before:absolute before:inset-1 before:rounded-lg before:bg-linear-(--patreon-gradient) before:blur-lg after:absolute after:inset-0 after:z-10 after:rounded-lg after:bg-linear-(--patreon-gradient)",
					)}
					href="/premium"
				>
					<span className="z-20 flex items-center gap-2">
						<Patreon className="size-5" />
						{guild.premium ? "Perks Active" : "Get Premium"}
					</span>
				</HeroLink>

				<Card className="border border-white/10 bg-darker/90 p-2">
					<Card.Content className="p-0">
						<ul className="flex flex-col gap-1 whitespace-nowrap">
							<Item guildId={guild.id} isActive={currentDashSection === "overview"} name="Overview" path="">
								<Settings className="size-5" />
							</Item>
							<Item guildId={guild.id} isActive={currentDashSection === "leveling"} name="Leveling" path="leveling">
								<TrendingUp className="size-5" />
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
								<RocketLaunch className="size-5" />
							</Item>
							<Item guildId={guild.id} isActive={currentDashSection === "roles"} name="Role Management" path="roles">
								<FormatListBulleted className="size-5" />
							</Item>
							<Item
								guildId={guild.id}
								isActive={currentDashSection === "milestones"}
								name="Milestones"
								path="milestones"
							>
								<Signpost className="size-5" />
							</Item>
							<Item guildId={guild.id} isActive={currentDashSection === "emojis"} name="Emoji List" path="emojis">
								<EmojiEmotions className="size-5" />
							</Item>
							<Item
								guildId={guild.id}
								isActive={currentDashSection === "miscellaneous"}
								name="Miscellaneous"
								path="miscellaneous"
							>
								<MiscellaneousServices className="size-5" />
							</Item>
							<Item guildId={guild.id} isActive={currentDashSection === "danger"} name="Danger Zone" path="danger">
								<Warning className="size-5" />
							</Item>
						</ul>
					</Card.Content>
				</Card>
			</div>
		</aside>
	);
}

function Item({ guildId, name, path, isActive, children }: ItemProps) {
	return (
		<li>
			<Link
				className={clsx(
					"flex items-center gap-3 rounded-lg py-2 pr-3 pl-2 transition-colors hover:bg-white/10",
					isActive && "bg-white/10",
				)}
				href={`/guilds/${guildId}/${path}`}
				type="button"
			>
				<div className="flex size-8 items-center justify-center rounded-md bg-white/5 text-white/75">{children}</div>
				<span className={clsx("font-medium text-sm", path === "danger" && "text-red")}>{name}</span>
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
