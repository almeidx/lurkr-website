"use client";

import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { getUser } from "@/lib/auth.ts";
import { userAvatar } from "@/utils/discord-cdn.ts";
import { Menu, MenuButton, MenuButtonArrow, MenuItem, MenuSeparator, useMenuStore } from "@ariakit/react/menu";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SUPPORT_SERVER_INVITE } from "../../shared-links.mjs";

export function ProfileButton({ avatar, globalName, id, username }: ReturnType<typeof getUser>) {
	const store = useMenuStore({});
	const open = store.useState("open");
	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intended.
	useEffect(() => {
		store.setOpen(false);
	}, [pathname]);

	return (
		<>
			<MenuButton store={store} className="flex items-center justify-center gap-2 rounded-lg bg-light-gray px-2 py-1">
				<ImageWithFallback
					alt="Your profile picture"
					className="aspect-square rounded-full"
					fallback={fallbackAvatarImg}
					src={userAvatar(id, avatar, { size: 32 })}
					height={24}
					width={24}
					unoptimized={Boolean(avatar)}
				/>

				<p className="max-w-16 md:max-w-32 xl:max-w-56 truncate">{globalName ?? username}</p>

				<MenuButtonArrow className={clsx("transition duration-150 ease-in-out", open ? "rotate-180" : "rotate-0")} />
			</MenuButton>

			<Menu
				gutter={8}
				store={store}
				className="rounded-lg bg-dark-gray px-3 py-2 min-w-52 flex flex-col gap-2 z-[10003]"
			>
				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<Link href="/guilds">Your servers</Link>
				</MenuItem>

				<MenuSeparator className="border-white/25" />

				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<a href={SUPPORT_SERVER_INVITE}>Support server</a>
				</MenuItem>

				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<a href="/api/auth/logout">Logout</a>
				</MenuItem>
			</Menu>
		</>
	);
}
