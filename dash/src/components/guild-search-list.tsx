"use client";

import clsx from "clsx";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { Send } from "@/components/icons/mdi/send.tsx";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { guildIcon, type Snowflake } from "@/utils/discord-cdn.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";

export function GuildSearchList<Guild extends SearchableGuild>({
	guilds,
	link,
	linkById,
}: GuildSearchListProps<Guild>) {
	const pathname = usePathname();
	const [term, setTerm] = useState("");

	const filteredGuilds = matchSorter(guilds, term, { keys: ["name", "id"] });
	const targetGuild =
		filteredGuilds.length === 1
			? filteredGuilds[0]
			: isSnowflake(term)
				? filteredGuilds.find((guild) => guild.id === term)
				: undefined;
	const target = targetGuild ? link(targetGuild) : isSnowflake(term) ? linkById?.(term) : undefined;

	function handleTermChange(event: ChangeEvent<HTMLInputElement>) {
		setTerm(event.target.value);
	}

	return (
		<>
			<div className="mt-12 flex items-center gap-4">
				<input
					className="h-10 w-72 rounded-lg bg-light-gray px-4 py-3 shadow-xs md:w-96"
					onChange={handleTermChange}
					placeholder={guilds.length || !linkById ? "Enter a server name or id…" : "Enter a server id…"}
					type="text"
					value={term}
				/>

				<Link
					className={clsx(
						"flex size-9 items-center justify-center rounded-lg bg-green",
						!target && "cursor-not-allowed bg-green-400/50",
					)}
					href={target?.href ?? pathname}
					prefetch={false}
				>
					<span className="sr-only">
						{target?.invite ? "Add Lurkr to the searched server" : "Go to the searched server"}
					</span>
					<Send className="size-7" />
				</Link>
			</div>

			{guilds.length ? (
				<div className="my-7 flex max-w-2xl flex-wrap justify-center gap-12">
					{filteredGuilds.map((guild, idx) => (
						<Link
							className="group relative flex size-20 items-center justify-center rounded-lg border border-white/25 bg-darker"
							href={link(guild).href}
							key={guild.id}
							prefetch={false}
						>
							<div
								className="invisible absolute -top-14 -left-11 z-50 w-40 rounded-lg bg-darker px-3 py-2 text-white shadow-md outline outline-white/25 group-focus-within:visible group-hover:visible"
								role="tooltip"
							>
								<p className="truncate text-center">{guild.name}</p>

								<div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-darker shadow-md [box-shadow:0_-1px_0_rgba(255,255,255,0.25)_inset,-1px_0_0_rgba(255,255,255,0.25)_inset]" />
							</div>

							<ImageWithFallback
								alt={`${guild.name} server icon`}
								className="size-19 rounded-full"
								fallback={fallbackAvatarImg}
								height={76}
								priority={idx < 25}
								src={guildIcon(guild.id, guild.icon)}
								unoptimized={Boolean(guild.icon)}
								width={76}
							/>
						</Link>
					))}
				</div>
			) : null}
		</>
	);
}

export interface GuildLink {
	readonly href: string;
	/** The link adds Lurkr to the server instead of opening it. */
	readonly invite: boolean;
}

interface SearchableGuild {
	readonly icon: string | null;
	readonly id: Snowflake;
	readonly name: string;
}

interface GuildSearchListProps<Guild extends SearchableGuild> {
	readonly guilds: Guild[];
	readonly link: (guild: Guild) => GuildLink;
	/** Where a server id that matches none of `guilds` leads. Without it, such ids lead nowhere. */
	readonly linkById?: (id: Snowflake) => GuildLink;
}
