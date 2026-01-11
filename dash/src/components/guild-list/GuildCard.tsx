import Link from "next/link";
import type { ReactNode } from "react";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";

export function GuildCard({ guild, href, badge }: GuildCardProps) {
	return (
		<Link
			className="group flex items-center gap-3 rounded-xl border border-white/10 bg-surface/50 p-2.5 transition-colors hover:border-white/20 hover:bg-white/5"
			href={href}
			prefetch={false}
		>
			<div className="relative shrink-0">
				{badge}
				<ImageWithFallback
					alt={`${guild.name} icon`}
					className="size-9 rounded-lg"
					fallback={fallbackAvatarImg}
					height={36}
					src={guildIcon(guild.id, guild.icon)}
					unoptimized={Boolean(guild.icon)}
					width={36}
				/>
			</div>

			<p className="min-w-0 flex-1 truncate text-sm text-white/80 group-hover:text-white">{guild.name}</p>
		</Link>
	);
}

export interface BaseGuildInfo {
	icon: string | null;
	id: Snowflake;
	name: string;
}

interface GuildCardProps {
	badge?: ReactNode;
	guild: BaseGuildInfo;
	href: string;
}
