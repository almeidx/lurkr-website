"use client";

import type { GuildInfo } from "@/app/(dashboard)/levels/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { Send } from "@/components/icons/mdi/send.tsx";
import { guildIcon } from "@/utils/discord-cdn.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import clsx from "clsx";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { type ChangeEvent, useState } from "react";

export function LeaderboardGuildList({ guilds }: { readonly guilds: GuildInfo[] }) {
	const [term, setTerm] = useState("");

	const filteredGuilds = matchSorter(guilds, term, { keys: ["name", "id"] });
	const termGuild = term.length && isSnowflake(term) ? filteredGuilds.find((guild) => guild.id === term) : null;

	const filteredGuildHref = filteredGuilds.length === 1 ? `/levels/${filteredGuilds[0]!.id}` : null;
	const termGuildHref = termGuild ? `/levels/${termGuild.id}` : null;
	const targetGuildHref = filteredGuildHref ?? termGuildHref ?? (isSnowflake(term) ? `/levels/${term}` : null);

	function handleTermChange(event: ChangeEvent<HTMLInputElement>) {
		setTerm(event.target.value);
	}

	return (
		<>
			<div className="mt-12 flex items-center gap-4">
				<input
					type="text"
					placeholder="Enter a server name or id…"
					className="h-10 w-72 rounded-lg bg-light-gray px-4 py-3 shadow-xs md:w-96"
					value={term}
					onChange={handleTermChange}
				/>

				<Link
					href={targetGuildHref ?? "/levels"}
					className={clsx(
						"flex size-9 items-center justify-center rounded-lg bg-green",
						!targetGuildHref && "cursor-not-allowed bg-green-400/50",
					)}
					prefetch={false}
				>
					<span className="sr-only">{targetGuildHref?.startsWith("https:") ? "Go to the searched server" : null}</span>
					<Send className="size-7" />
				</Link>
			</div>

			<div className="my-7 flex max-w-2xl flex-wrap justify-center gap-12">
				{filteredGuilds.map((guild, idx) => (
					<Link
						className="group relative flex size-20 items-center justify-center rounded-lg border border-white/25 bg-[#1e1f22]"
						href={`/levels/${guild.vanity ?? guild.id}`}
						key={guild.id}
						prefetch={false}
					>
						<div
							className="-left-11 -top-14 invisible absolute z-50 w-40 rounded-lg bg-darker px-3 py-2 text-white shadow-md outline outline-white/25 group-hover:visible"
							role="tooltip"
						>
							<p className="truncate text-center">{guild.name}</p>

							<div className="-bottom-1.5 -translate-x-1/2 absolute left-1/2 size-3 rotate-45 bg-darker shadow-md [box-shadow:0_-1px_0_rgba(255,255,255,0.25)_inset,-1px_0_0_rgba(255,255,255,0.25)_inset]" />
						</div>

						<ImageWithFallback
							alt={`${guild.name} server icon`}
							className="size-19 rounded-full"
							height={76}
							src={guildIcon(guild.id, guild.icon)}
							width={76}
							fallback={fallbackAvatarImg}
							unoptimized={Boolean(guild.icon)}
							priority={idx < 25}
						/>
					</Link>
				))}
			</div>
		</>
	);
}

export function LeaderboardGuildInput() {
	const [guildId, setGuildId] = useState("");

	const guildHref = isSnowflake(guildId) ? `/levels/${guildId}?page=1` : null;

	function handleGuildIdChange(event: ChangeEvent<HTMLInputElement>) {
		setGuildId(event.target.value);
	}

	return (
		<>
			<div className="mt-12 flex items-center gap-4">
				<input
					type="text"
					placeholder="Enter a server id…"
					className="h-10 w-72 rounded-lg bg-light-gray px-4 py-3 shadow-xs md:w-96"
					value={guildId}
					onChange={handleGuildIdChange}
				/>

				<Link
					href={guildHref ?? "/levels"}
					className={clsx(
						"flex size-9 items-center justify-center rounded-lg bg-green-400",
						!guildHref && "cursor-not-allowed bg-green-400/50",
					)}
					prefetch={false}
				>
					<span className="sr-only">Go to the searched server</span>
					<Send className="size-7" />
				</Link>
			</div>

			<div className="mt-6 flex flex-col items-center gap-2 text-center text-white/75 text-xl tracking-tight">
				If you wish to see the servers you have access to, please login.
				<SignInButton />
			</div>
		</>
	);
}
