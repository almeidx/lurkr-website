"use client";

import { type GuildLink, GuildSearchList } from "@/components/guild-search-list.tsx";
import { sectionHref } from "@/components/navigation/dashboard-sections.ts";
import type { UserGuildInfo } from "@/lib/guild.ts";
import { BOT_INVITE } from "@/shared-links.ts";

export function DashboardGuildList({ guilds }: { readonly guilds: UserGuildInfo[] }) {
	return <GuildSearchList guilds={guilds} link={dashboardLink} />;
}

function dashboardLink(guild: UserGuildInfo): GuildLink {
	if (guild.botIn) {
		return { href: sectionHref(guild.id, ""), invite: false };
	}

	const invite = new URL(BOT_INVITE);
	invite.searchParams.set("guild_id", guild.id);
	return { href: invite.href, invite: true };
}
