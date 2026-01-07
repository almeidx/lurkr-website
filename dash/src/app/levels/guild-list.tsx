"use client";

import { SearchField } from "@heroui/react";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { useState } from "react";
import type { GuildInfo } from "@/app/levels/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { Send } from "@/components/icons/mdi/send.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { guildIcon } from "@/utils/discord-cdn.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";

export function LeaderboardGuildList({ guilds }: { readonly guilds: GuildInfo[] }) {
	const [term, setTerm] = useState("");

	const filteredGuilds = matchSorter(guilds, term, { keys: ["name", "id"] });

	return (
		<>
			<SearchField aria-label="Search servers" className="mt-12 w-72 md:w-96" onChange={setTerm} value={term}>
				<SearchField.Group>
					<SearchField.SearchIcon />
					<SearchField.Input placeholder="Search servers…" />
					<SearchField.ClearButton />
				</SearchField.Group>
			</SearchField>

			<div className="my-7 flex max-w-2xl flex-wrap justify-center gap-8">
				{filteredGuilds.map((guild, idx) => (
					<GuildCard guild={guild} key={guild.id} priority={idx < 25} />
				))}
			</div>

			{filteredGuilds.length === 0 && (
				<p className="mt-8 text-lg text-zinc-400">No servers found matching your search.</p>
			)}
		</>
	);
}

function GuildCard({ guild, priority }: { guild: GuildInfo; priority: boolean }) {
	return (
		<Link
			className="flex w-24 flex-col items-center gap-2 rounded-xl p-2 transition-all hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			href={`/levels/${guild.vanity ?? guild.id}`}
			prefetch={false}
		>
			<div className="flex size-16 items-center justify-center rounded-xl bg-surface ring-1 ring-white/20">
				<ImageWithFallback
					alt=""
					className="size-14 rounded-full"
					fallback={fallbackAvatarImg}
					height={56}
					priority={priority}
					src={guildIcon(guild.id, guild.icon)}
					unoptimized={Boolean(guild.icon)}
					width={56}
				/>
			</div>
			<span className="w-full truncate text-center text-sm text-zinc-300">{guild.name}</span>
		</Link>
	);
}

export function LeaderboardGuildInput() {
	const [guildId, setGuildId] = useState("");

	const guildHref = isSnowflake(guildId) ? `/levels/${guildId}?page=1` : null;

	return (
		<>
			<div className="mt-12 flex items-center gap-3">
				<SearchField
					aria-label="Search by server ID"
					className="w-72 md:w-96"
					onChange={setGuildId}
					onSubmit={() => {
						if (guildHref) {
							window.location.href = guildHref;
						}
					}}
					value={guildId}
				>
					<SearchField.Group>
						<SearchField.SearchIcon />
						<SearchField.Input placeholder="Enter a server id…" />
						<SearchField.ClearButton />
					</SearchField.Group>
				</SearchField>

				<Link
					aria-disabled={!guildHref}
					className={`flex size-9 items-center justify-center rounded-lg bg-green text-white transition-opacity ${guildHref ? "" : "pointer-events-none opacity-50"}`}
					href={guildHref ?? "/levels"}
					prefetch={false}
				>
					<span className="sr-only">Go to the searched server</span>
					<Send className="size-5" />
				</Link>
			</div>

			<div className="mt-6 flex flex-col items-center gap-2 text-center text-xl text-zinc-400 tracking-tight">
				If you wish to see the servers you have access to, please login.
				<SignInButton />
			</div>
		</>
	);
}
