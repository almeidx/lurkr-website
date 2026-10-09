"use client";

import {
	ComboboxItem,
	ComboboxPopover,
	ComboboxSelect,
	ComboboxSelectArrow,
	ComboboxSelectLabel,
	useComboboxStore,
	useStoreState,
} from "@ariakit/react";
import Link from "next/link";
import { LeaderboardVisibility } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function EditLeaderboardVisibility({ defaultValue, guildId, nsfw }: EditLeaderboardVisibilityProps) {
	const initialValue =
		nsfw && defaultValue === LeaderboardVisibility.Public ? LeaderboardVisibility.MembersOnly : defaultValue;
	const combobox = useComboboxStore({ defaultSelectedValue: initialValue });
	const value = useStoreState(combobox, "selectedValue") as LeaderboardVisibility;

	return (
		<div className="flex flex-col gap-2">
			<ComboboxSelectLabel className="text-lg tracking-tight text-white/75 md:text-xl" store={combobox}>
				Choose the visibility for the{" "}
				<Link
					className="text-blurple"
					href={`/levels/${guildId}`}
					prefetch={false}
					rel="noopener noreferrer"
					target="_blank"
				>
					web leaderboard
				</Link>
				:
			</ComboboxSelectLabel>

			<ComboboxSelect
				className="flex h-10 w-56 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				name="leaderboardVisibility"
				required
				store={combobox}
			>
				<span>{getLabel(value)}</span>

				<ComboboxSelectArrow />
			</ComboboxSelect>

			<ComboboxPopover
				className="z-10000 flex w-40 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-56"
				gutter={8}
				sameWidth
				store={combobox}
			>
				<ComboboxItem disabled={nsfw} store={combobox} value={LeaderboardVisibility.Public}>
					Public
				</ComboboxItem>
				<ComboboxItem store={combobox} value={LeaderboardVisibility.MembersOnly}>
					Members-only
				</ComboboxItem>
				<ComboboxItem store={combobox} value={LeaderboardVisibility.ManagersOnly}>
					Managers-only
				</ComboboxItem>
			</ComboboxPopover>

			<p className="text-white/75">{getSubtitle(value)}</p>

			{nsfw ? (
				<p className="text-white/75">
					This server is flagged as age-restricted (NSFW) by Discord, so its web leaderboard cannot be public.
				</p>
			) : null}
		</div>
	);
}

function getLabel(visibility: LeaderboardVisibility) {
	switch (visibility) {
		case LeaderboardVisibility.Public:
			return "Public";
		case LeaderboardVisibility.MembersOnly:
			return "Members-only";
		case LeaderboardVisibility.ManagersOnly:
			return "Managers-only";
	}
}

function getSubtitle(visibility: LeaderboardVisibility) {
	switch (visibility) {
		case LeaderboardVisibility.Public:
			return "Anyone can see it, including non-members and search engines.";
		case LeaderboardVisibility.MembersOnly:
			return "Only logged-in members of this server can see it. This is the default setting.";
		case LeaderboardVisibility.ManagersOnly:
			return "Only people with Manage Messages, Manage Server, or Administrator permissions can see it.";
	}
}

interface EditLeaderboardVisibilityProps {
	readonly defaultValue: LeaderboardVisibility;
	readonly guildId: Snowflake;
	readonly nsfw: boolean;
}
