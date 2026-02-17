import { Menu, MenuButton, MenuButtonArrow, MenuItem, MenuProvider, MenuSeparator } from "@ariakit/react";
import Link from "next/link";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { User } from "@/lib/auth.ts";
import { logout } from "@/lib/logout.ts";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.ts";
import { userAvatar } from "@/utils/discord-cdn.ts";

export function ProfileButton({ avatar, globalName, id, username }: User) {
	return (
		<MenuProvider>
			<MenuButton className="group flex w-fit items-center justify-center gap-2 rounded-lg bg-light-gray px-2 py-1">
				<ImageWithFallback
					alt="Your profile picture"
					className="aspect-square rounded-full"
					fallback={fallbackAvatarImg}
					height={24}
					priority
					src={userAvatar(id, avatar, { size: 32 })}
					unoptimized={Boolean(avatar)}
					width={24}
				/>

				<p className="max-w-16 truncate md:max-w-32 xl:max-w-56">{globalName ?? username}</p>

				<MenuButtonArrow className="transition ease-in-out group-aria-expanded:rotate-180" />
			</MenuButton>

			<Menu className="z-10003 flex min-w-52 flex-col gap-2 rounded-lg bg-dark-gray px-3 py-2" gutter={8}>
				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<Link className="block w-full" href="/profile">
						Your profile
					</Link>
				</MenuItem>

				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<Link className="block w-full" href="/guilds">
						Your servers
					</Link>
				</MenuItem>

				<MenuSeparator className="border-white/25" />

				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<a className="block w-full" href={SUPPORT_SERVER_INVITE}>
						Support server
					</a>
				</MenuItem>

				<MenuItem className="rounded-lg px-2 py-1 hover:bg-light-gray/30">
					<form action={logout}>
						<button className="block w-full text-left" type="submit">
							Logout
						</button>
					</form>
				</MenuItem>
			</Menu>
		</MenuProvider>
	);
}
