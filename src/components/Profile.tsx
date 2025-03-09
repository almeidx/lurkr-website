import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { User } from "@/lib/auth.ts";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.js";
import { userAvatar } from "@/utils/discord-cdn.ts";
import { Menu, MenuButton, MenuButtonArrow, MenuItem, MenuProvider, MenuSeparator } from "@ariakit/react";
import Link from "next/link";

export function ProfileButton({ avatar, globalName, id, username }: User) {
	return (
		<MenuProvider>
			<MenuButton className="group flex w-fit items-center justify-center gap-2 rounded-lg bg-light-gray px-2 py-1">
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

				<MenuButtonArrow className="transition ease-in-out group-aria-expanded:rotate-180" />
			</MenuButton>

			<Menu gutter={8} className="z-10003 flex min-w-52 flex-col gap-2 rounded-lg bg-dark-gray px-3 py-2">
				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<Link href="/guilds" className="block w-full">
						Your servers
					</Link>
				</MenuItem>

				<MenuSeparator className="border-white/25" />

				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<a href={SUPPORT_SERVER_INVITE} className="block w-full">
						Support server
					</a>
				</MenuItem>

				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<a href="/api/auth/logout" className="block w-full">
						Logout
					</a>
				</MenuItem>
			</Menu>
		</MenuProvider>
	);
}
