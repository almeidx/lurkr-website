import Link from "next/link";
import type { ReactNode } from "react";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";

export function GuildCard({ guild, href, badge, variant = "default" }: GuildCardProps) {
	return (
		<Link
			className={`group flex items-center gap-3 rounded-xl border border-white/10 bg-surface/50 p-3 transition-all duration-150 hover:scale-[1.02] hover:border-white/20 hover:bg-white/5 ${variant === "muted" ? "opacity-60 hover:opacity-100" : ""}`}
			href={href}
			prefetch={false}
		>
			<div className="relative shrink-0">
				{badge}
				<ImageWithFallback
					alt={`${guild.name} icon`}
					className="size-11 rounded-lg"
					fallback={fallbackAvatarImg}
					height={44}
					src={guildIcon(guild.id, guild.icon)}
					unoptimized={Boolean(guild.icon)}
					width={44}
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
	variant?: "default" | "muted";
}
