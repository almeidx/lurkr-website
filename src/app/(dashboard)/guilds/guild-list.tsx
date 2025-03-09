"use client";

import type { GuildInfo } from "@/app/(dashboard)/guilds/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { Send } from "@/components/icons/mdi/send.tsx";
import { BOT_INVITE } from "@/shared-links.js";
import { guildIcon } from "@/utils/discord-cdn.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import clsx from "clsx";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { type ChangeEvent, useState } from "react";

export function DashboardGuildList({ guilds }: { readonly guilds: GuildInfo[] }) {
	const [term, setTerm] = useState("");

	const filteredGuilds = matchSorter(guilds, term, { keys: ["name", "id"] });
	const termGuild = term.length && isSnowflake(term) ? filteredGuilds.find((guild) => guild.id === term) : null;

	const filteredGuildHref = filteredGuilds.length === 1 ? guildHref(filteredGuilds[0]) : null;
	const termGuildHref = termGuild ? guildHref(termGuild) : null;
	const targetGuildHref = filteredGuildHref ?? termGuildHref;

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
					href={targetGuildHref ?? "/guilds"}
					className={clsx(
						"flex size-9 items-center justify-center rounded-lg bg-green",
						!targetGuildHref && "cursor-not-allowed bg-green-400/50",
					)}
					prefetch={false}
				>
					<span className="sr-only">
						{targetGuildHref?.startsWith("https:") ? "Add Lurkr to the searched guild" : "Go to the searched guild"}
					</span>
					<Send className="size-7" />
				</Link>
			</div>

			<div className="my-7 flex max-w-2xl flex-wrap justify-center gap-12">
				{filteredGuilds.map((guild, idx) => (
					<Link
						className="group relative flex size-20 items-center justify-center rounded-lg border border-white/25 bg-[#1e1f22]"
						href={guildHref(guild)}
						key={guild.id}
						prefetch={false}
					>
						<div
							className="-left-11 -top-14 invisible absolute z-50 w-40 rounded-lg bg-darker px-3 py-2 text-white shadow-md outline outline-white/25 group-focus-within:visible group-hover:visible"
							role="tooltip"
						>
							<p className="truncate text-center">{guild.name}</p>

							<div className="-bottom-1.5 -translate-x-1/2 absolute left-1/2 size-3 rotate-45 bg-darker shadow-md [box-shadow:0_-1px_0_rgba(255,255,255,0.25)_inset,-1px_0_0_rgba(255,255,255,0.25)_inset]" />
						</div>

						<ImageWithFallback
							alt={`${guild.name} server icon`}
							className="size-[75px] rounded-full"
							height={75}
							src={guildIcon(guild.id, guild.icon)}
							width={75}
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

function guildHref(guild: GuildInfo | undefined) {
	if (guild) {
		if (guild.botIn) {
			return `/guilds/${guild.id}`;
		}

		const invite = new URL(BOT_INVITE);
		invite.searchParams.set("guild_id", guild.id);
		return invite.toString();
	}

	return BOT_INVITE;
}
