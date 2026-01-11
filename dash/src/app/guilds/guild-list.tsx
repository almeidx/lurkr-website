"use client";

import { Check, Magnifier } from "@gravity-ui/icons";
import { SearchField } from "@heroui/react";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { useState } from "react";
import type { GuildInfo } from "@/app/guilds/page.tsx";
import { GuildCard, GuildGrid, GuildSectionHeader } from "@/components/guild-list";
import { BOT_INVITE } from "@/shared-links.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";

export function DashboardGuildList({ guilds }: { readonly guilds: GuildInfo[] }) {
	const [term, setTerm] = useState("");

	const filteredGuilds = matchSorter(guilds, term, { keys: ["name", "id"] });
	const termGuild = term.length && isSnowflake(term) ? filteredGuilds.find((guild) => guild.id === term) : null;

	const filteredGuildHref = filteredGuilds.length === 1 ? guildHref(filteredGuilds[0]) : null;
	const termGuildHref = termGuild ? guildHref(termGuild) : null;
	const targetGuildHref = filteredGuildHref ?? termGuildHref;

	const guildsWithBot = filteredGuilds.filter((g) => g.botIn);
	const guildsWithoutBot = filteredGuilds.filter((g) => !g.botIn);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<SearchField aria-label="Search servers" className="w-full sm:max-w-md" onChange={setTerm} value={term}>
					<SearchField.Group className="border-white/10 bg-surface/50">
						<SearchField.SearchIcon />
						<SearchField.Input placeholder="Search by name or ID..." />
						<SearchField.ClearButton isDisabled={term === ""} />
					</SearchField.Group>
				</SearchField>

				{targetGuildHref && (
					<Link
						className="flex items-center gap-2 rounded-xl bg-gradient-lurkr px-4 py-2.5 font-medium text-black transition-opacity hover:opacity-90"
						href={targetGuildHref}
						prefetch={false}
					>
						<Magnifier className="size-4" />
						{targetGuildHref.startsWith("https:") ? "Invite to server" : "Go to server"}
					</Link>
				)}
			</div>

			{guildsWithBot.length > 0 && (
				<section className="flex flex-col gap-4">
					<GuildSectionHeader
						chipClassName="flex items-center gap-1 bg-green/20 text-green"
						chipContent={
							<>
								<Check className="size-3" />
								<span>Lurkr Installed</span>
							</>
						}
						count={guildsWithBot.length}
					/>

					<GuildGrid>
						{guildsWithBot.map((guild) => (
							<GuildCard badge={<BotInstalledBadge />} guild={guild} href={guildHref(guild)} key={guild.id} />
						))}
					</GuildGrid>
				</section>
			)}

			{guildsWithoutBot.length > 0 && (
				<section className="flex flex-col gap-4">
					<GuildSectionHeader
						chipClassName="bg-white/10 text-white/60"
						chipContent="Available to Add"
						count={guildsWithoutBot.length}
					/>

					<GuildGrid>
						{guildsWithoutBot.map((guild) => (
							<GuildCard guild={guild} href={guildHref(guild)} key={guild.id} />
						))}
					</GuildGrid>
				</section>
			)}

			{filteredGuilds.length === 0 && term && (
				<div className="flex flex-col items-center gap-4 py-12 text-center">
					<div className="flex size-16 items-center justify-center rounded-full bg-white/5">
						<Magnifier className="size-8 text-white/40" />
					</div>
					<div>
						<p className="font-medium text-lg text-white">No servers found</p>
						<p className="text-white/50">Try a different search term</p>
					</div>
				</div>
			)}
		</div>
	);
}

function BotInstalledBadge() {
	return (
		<div className="absolute -right-0.5 -bottom-0.5 z-10 flex size-4 items-center justify-center rounded-full bg-green ring-2 ring-surface">
			<Check className="size-2.5 text-white" />
		</div>
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
