"use client";

import { SearchField } from "@heroui/react";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { GuildInfo } from "@/app/guilds/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { BOT_INVITE } from "@/shared-links.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";

export function DashboardGuildList({ guilds }: { readonly guilds: GuildInfo[] }) {
	const [term, setTerm] = useState("");

	const filteredGuilds = matchSorter(guilds, term, { keys: ["name", "id"] });

	const { withBot, withoutBot } = useMemo(() => {
		const withBot: GuildInfo[] = [];
		const withoutBot: GuildInfo[] = [];
		for (const guild of filteredGuilds) {
			if (guild.botIn) {
				withBot.push(guild);
			} else {
				withoutBot.push(guild);
			}
		}
		return { withBot, withoutBot };
	}, [filteredGuilds]);

	return (
		<>
			<SearchField aria-label="Search servers" className="mt-12 w-72 md:w-96" onChange={setTerm} value={term}>
				<SearchField.Group>
					<SearchField.SearchIcon />
					<SearchField.Input placeholder="Search servers…" />
					<SearchField.ClearButton />
				</SearchField.Group>
			</SearchField>

			{withBot.length > 0 && (
				<GuildSection title="Servers with Lurkr">
					{withBot.map((guild, idx) => (
						<GuildCard guild={guild} key={guild.id} priority={idx < 25} />
					))}
				</GuildSection>
			)}

			{withoutBot.length > 0 && (
				<GuildSection title="Invite Lurkr">
					{withoutBot.map((guild, idx) => (
						<GuildCard guild={guild} key={guild.id} priority={withBot.length + idx < 25} />
					))}
				</GuildSection>
			)}

			{filteredGuilds.length === 0 && (
				<p className="mt-8 text-lg text-zinc-400">No servers found matching your search.</p>
			)}
		</>
	);
}

function GuildSection({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="mt-8 flex flex-col items-center">
			<h2 className="mb-4 font-semibold text-lg text-zinc-300">{title}</h2>
			<div className="flex max-w-2xl flex-wrap justify-center gap-8">{children}</div>
		</section>
	);
}

function GuildCard({ guild, priority }: { guild: GuildInfo; priority: boolean }) {
	return (
		<Link
			className="flex w-24 flex-col items-center gap-2 rounded-xl p-2 transition-all hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			href={guildHref(guild)}
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
