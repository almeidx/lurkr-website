"use client";

import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { User } from "@/lib/auth.ts";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.mjs";
import { userAvatar } from "@/utils/discord-cdn.ts";
import {
	Menu,
	MenuButton,
	MenuButtonArrow,
	MenuItem,
	MenuSeparator,
	useMenuStore,
	useStoreState,
} from "@ariakit/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ProfileButton({ avatar, globalName, id, username }: User) {
	const store = useMenuStore();
	const open = useStoreState(store, "open");
	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intended.
	useEffect(() => {
		store.setOpen(false);
	}, [pathname]);

	return (
		<>
			<MenuButton
				store={store}
				className="flex w-fit items-center justify-center gap-2 rounded-lg bg-light-gray px-2 py-1"
			>
				<ImageWithFallback
					alt="Your profile picture"
					className="aspect-square rounded-full"
					fallback={fallbackAvatarImg}
					src={userAvatar(id, avatar, { size: 32 })}
					height={24}
					width={24}
					unoptimized={Boolean(avatar)}
					priority
				/>

				<p className="max-w-16 truncate md:max-w-32 xl:max-w-56">{globalName ?? username}</p>

				<MenuButtonArrow className={clsx("transition ease-in-out", open ? "rotate-180" : "rotate-0")} />
			</MenuButton>

			<Menu
				gutter={8}
				store={store}
				className="z-[10003] flex min-w-52 flex-col gap-2 rounded-lg bg-dark-gray px-3 py-2"
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
