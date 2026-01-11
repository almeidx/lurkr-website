"use client";

import { ArrowRight, Person } from "@gravity-ui/icons";
import { SearchField } from "@heroui/react";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useState } from "react";
import type { GuildInfo } from "@/app/levels/page.tsx";
import { GuildCard, GuildGrid, GuildSectionHeader } from "@/components/guild-list";
import { SignInButton } from "@/components/SignIn.tsx";
import { isSnowflake } from "@/utils/is-snowflake.ts";

export function LeaderboardGuildList({ guilds }: { readonly guilds: GuildInfo[] }) {
	const router = useRouter();
	const [term, setTerm] = useState("");

	const filteredGuilds = matchSorter(guilds, term, { keys: ["name", "id", "vanity"] });

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter" && term.trim()) {
			const match = filteredGuilds[0];
			if (match) {
				router.push(`/levels/${match.vanity ?? match.id}`);
			} else if (isSnowflake(term.trim())) {
				router.push(`/levels/${term.trim()}`);
			}
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<SearchField aria-label="Search servers" className="w-full sm:max-w-md" onChange={setTerm} value={term}>
				<SearchField.Group className="border-white/10 bg-surface/50">
					<SearchField.SearchIcon />
					<SearchField.Input onKeyDown={handleKeyDown} placeholder="Search your servers or enter any server ID..." />
					<SearchField.ClearButton isDisabled={term === ""} />
				</SearchField.Group>
			</SearchField>

			{filteredGuilds.length > 0 && (
				<section className="flex flex-col gap-4">
					<GuildSectionHeader
						chipClassName="bg-white/10 text-white/60"
						chipContent="Leveling Enabled"
						count={filteredGuilds.length}
					/>
					<GuildGrid>
						{filteredGuilds.map((guild) => (
							<GuildCard guild={guild} href={`/levels/${guild.vanity ?? guild.id}`} key={guild.id} />
						))}
					</GuildGrid>
				</section>
			)}

			{guilds.length === 0 && (
				<div className="rounded-xl border border-white/10 bg-surface/30 p-6 text-center">
					<p className="text-white/60">None of your servers have leveling enabled yet.</p>
					<p className="mt-1 text-sm text-white/40">You can still enter any server ID above to view its leaderboard.</p>
				</div>
			)}

			{filteredGuilds.length === 0 && guilds.length > 0 && term && !isSnowflake(term.trim()) && (
				<div className="rounded-xl border border-white/10 bg-surface/30 p-6 text-center">
					<p className="text-white/60">No matching servers found.</p>
					<p className="mt-1 text-sm text-white/40">Try a server ID instead if you know it.</p>
				</div>
			)}
		</div>
	);
}

export function LeaderboardGuildInput() {
	const router = useRouter();
	const [term, setTerm] = useState("");

	const canNavigate = term.trim() && isSnowflake(term.trim());

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter" && canNavigate) {
			router.push(`/levels/${term.trim()}`);
		}
	}

	function handleGoClick() {
		if (canNavigate) {
			router.push(`/levels/${term.trim()}`);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex gap-2">
				<SearchField aria-label="Enter server ID" className="flex-1" onChange={setTerm} value={term}>
					<SearchField.Group className="border-white/10 bg-surface/50">
						<SearchField.SearchIcon />
						<SearchField.Input
							maxLength={19}
							onKeyDown={handleKeyDown}
							placeholder="Enter a server ID to view its leaderboard..."
						/>
						<SearchField.ClearButton isDisabled={term === ""} />
					</SearchField.Group>
				</SearchField>

				<button
					className="flex items-center justify-center rounded-xl bg-gradient-lurkr px-4 font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={!canNavigate}
					onClick={handleGoClick}
					type="button"
				>
					<ArrowRight className="size-5" />
				</button>
			</div>

			<div className="rounded-xl border border-white/10 bg-surface/30 p-6">
				<div className="flex items-start gap-4">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blurple/20">
						<Person className="size-5 text-blurple" />
					</div>
					<div className="flex-1">
						<p className="font-medium text-white">Sign in to see your servers</p>
						<p className="mt-1 text-sm text-white/60">
							Connect with Discord to quickly access leaderboards for servers where you have leveling enabled.
						</p>
						<div className="mt-3">
							<SignInButton />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
