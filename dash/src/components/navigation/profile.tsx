"use client";

import { ArrowRightFromSquare, ArrowUpRightFromSquare, ChevronDown, Person, Server } from "@gravity-ui/icons";
import { Button, Dropdown, Label, Separator } from "@heroui/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { User } from "@/lib/auth.ts";
import { logout } from "@/lib/logout.ts";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.ts";
import { userAvatar } from "@/utils/discord-cdn.ts";

export function ProfileButton({ avatar, globalName, id, username }: User) {
	const router = useRouter();

	function handleAction(key: string | number) {
		switch (key) {
			case "profile":
				router.push("/profile");
				break;
			case "servers":
				router.push("/guilds");
				break;
			case "support":
				window.open(SUPPORT_SERVER_INVITE, "_blank", "noopener,noreferrer");
				break;
			case "logout":
				logout();
				break;
		}
	}

	return (
		<>
			<div className="hidden md:block">
				<Dropdown>
					<Button className="bg-white/10 hover:bg-white/15" variant="ghost">
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

						<span className="max-w-32 truncate text-sm xl:max-w-56">{globalName ?? username}</span>
					</Button>

					<Dropdown.Popover className="min-w-48">
						<Dropdown.Menu onAction={handleAction}>
							<Dropdown.Item id="profile" textValue="Your profile">
								<Label>Your profile</Label>
							</Dropdown.Item>

							<Dropdown.Item id="servers" textValue="Your servers">
								<Label>Your servers</Label>
							</Dropdown.Item>

							<Separator />

							<Dropdown.Item id="support" textValue="Support server">
								<Label>Support server</Label>
							</Dropdown.Item>

							<Dropdown.Item id="logout" textValue="Logout">
								<Label>Logout</Label>
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>
			</div>

			<MobileProfileMenu avatar={avatar} globalName={globalName} id={id} username={username} />
		</>
	);
}

function MobileProfileMenu({
	avatar,
	globalName,
	id,
	username,
}: Pick<User, "avatar" | "globalName" | "id" | "username">) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="md:hidden">
			<div
				className={clsx(
					"grid transition-[grid-template-rows] duration-200 ease-out",
					expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
				)}
			>
				<ul className="mb-1 flex flex-col gap-0.5 overflow-hidden">
					<li>
						<Link
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
							href="/profile"
							tabIndex={expanded ? undefined : -1}
						>
							<Person aria-hidden className="size-5 shrink-0" />
							Your profile
						</Link>
					</li>

					<li>
						<Link
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
							href="/guilds"
							prefetch={false}
							tabIndex={expanded ? undefined : -1}
						>
							<Server aria-hidden className="size-5 shrink-0" />
							Your servers
						</Link>
					</li>

					<li>
						<a
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
							href={SUPPORT_SERVER_INVITE}
							rel="noopener noreferrer"
							tabIndex={expanded ? undefined : -1}
							target="_blank"
						>
							<ArrowUpRightFromSquare aria-hidden className="size-5 shrink-0" />
							Support server
						</a>
					</li>

					<li>
						<button
							className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
							onClick={() => logout()}
							tabIndex={expanded ? undefined : -1}
							type="button"
						>
							<ArrowRightFromSquare aria-hidden className="size-5 shrink-0" />
							Logout
						</button>
					</li>
				</ul>
			</div>

			<button
				className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
				onClick={() => setExpanded(!expanded)}
				type="button"
			>
				<ImageWithFallback
					alt="Your profile picture"
					className="aspect-square size-5 rounded-full"
					fallback={fallbackAvatarImg}
					height={20}
					src={userAvatar(id, avatar, { size: 32 })}
					unoptimized={Boolean(avatar)}
					width={20}
				/>

				<span className="flex-1 truncate text-left">{globalName ?? username}</span>

				<ChevronDown
					aria-hidden
					className={clsx("size-5 shrink-0 transition-transform", expanded ? "rotate-0" : "rotate-180")}
				/>
			</button>
		</div>
	);
}
