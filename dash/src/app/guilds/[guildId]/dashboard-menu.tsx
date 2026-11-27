"use client";

import { ChevronDown } from "@gravity-ui/icons";
import { Dropdown, Label } from "@heroui/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { Patreon } from "@/components/icons/Patreon.tsx";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { DASHBOARD_SECTIONS, sectionHref } from "@/components/navigation/dashboard-sections.ts";
import type { GuildMetadata, UserGuildInfo } from "@/lib/guild.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";

export function DashboardMenu({ guild, guilds }: DashboardMenuProps) {
	const pathname = usePathname();
	const { push } = useRouter();

	const currentPath = pathname.split("/")[3] ?? "";

	return (
		<div className="flex flex-col items-center gap-6 bg-transparent py-0 pr-8 pl-12 md:sticky md:top-12">
			<Dropdown>
				<Dropdown.Trigger className="flex w-full max-w-66 items-center justify-between rounded-lg bg-dark-gray px-3 py-2 shadow-inner">
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

					<ChevronDown aria-hidden className="size-4 shrink-0" />
				</Dropdown.Trigger>

				<Dropdown.Popover className="w-(--trigger-width) rounded-lg bg-dark-gray" maxHeight={384}>
					<Dropdown.Menu aria-label="Servers" onAction={(guildId) => push(sectionHref(guildId.toString(), ""))}>
						{guilds.map((guild) => (
							<Dropdown.Item
								className="gap-2 rounded-lg px-1.5 py-2 data-focus-visible:bg-white/10 data-hovered:bg-white/10"
								id={guild.id}
								key={guild.id}
								textValue={guild.name}
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

								<Label className="line-clamp-1 text-base font-normal">{guild.name}</Label>
							</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>

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
						{DASHBOARD_SECTIONS.map(({ danger, icon: Icon, iconClassName, label, path }) => (
							<li key={path}>
								<Link
									className={clsx(
										"flex items-center gap-7 rounded-xl py-2 pr-5 pl-3 transition-colors hover:bg-white/10",
										currentPath === path && "bg-white/10",
									)}
									href={sectionHref(guild.id, path)}
								>
									<div className="flex size-9 items-center justify-center rounded-xl bg-darker">
										<Icon className={clsx("size-5", iconClassName)} />
									</div>

									<span className={clsx("font-semibold", danger && "text-red")}>{label}</span>
								</Link>
							</li>
						))}
					</ul>
				</aside>
			</div>
		</div>
	);
}

interface DashboardMenuProps {
	readonly guild: GuildMetadata;
	readonly guilds: UserGuildInfo[];
}
