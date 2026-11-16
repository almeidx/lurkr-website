"use client";

import { leaderboardPath } from "@/app/levels/[entry]/leaderboard-path.ts";
import { type GuildLink, GuildSearchList } from "@/components/guild-search-list.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function LeaderboardGuildList({ guilds }: { readonly guilds: LeaderboardGuild[] }) {
	return (
		<GuildSearchList
			guilds={guilds}
			link={(guild) => leaderboardLink(guild.vanity ?? guild.id)}
			linkById={leaderboardLink}
		/>
	);
}

function leaderboardLink(entry: string): GuildLink {
	return { href: leaderboardPath(entry, 1), invite: false };
}

export interface LeaderboardGuild {
	icon: string | null;
	id: Snowflake;
	name: string;
	vanity: string | null;
}
