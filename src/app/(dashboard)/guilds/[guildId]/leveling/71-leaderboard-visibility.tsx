"use client";

import { LeaderboardVisibility } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import {
	Select,
	SelectArrow,
	SelectItem,
	SelectLabel,
	SelectPopover,
	useSelectStore,
	useStoreState,
} from "@ariakit/react";
import Link from "next/link";

export function EditLeaderboardVisibility({ defaultValue, guildId }: EditLeaderboardVisibilityProps) {
	const select = useSelectStore({ defaultValue });
	const value = useStoreState(select, "value") as LeaderboardVisibility;

	return (
		<div className="flex flex-col gap-2">
			<SelectLabel className="text-lg text-white/75 tracking-tight md:text-xl" store={select}>
				Choose the visibility for the{" "}
				<Link className="text-blurple" href={`/levels/${guildId}`} prefetch={false} target="_blank">
					web leaderboard
				</Link>
				:
			</SelectLabel>

			<Select
				store={select}
				className="flex h-10 w-56 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				name="leaderboardVisibility"
				required
			>
				<span>{getLabel(value)}</span>

				<SelectArrow />
			</Select>

			<SelectPopover
				store={select}
				gutter={8}
				sameWidth
				className="z-10000 flex w-40 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-56"
			>
				<SelectItem store={select} value={LeaderboardVisibility.Public}>
					Public
				</SelectItem>
				<SelectItem store={select} value={LeaderboardVisibility.MembersOnly}>
					Members-only
				</SelectItem>
				<SelectItem store={select} value={LeaderboardVisibility.ManagersOnly}>
					Managers-only
				</SelectItem>
			</SelectPopover>

			<p className="text-white/75">{getSubtitle(value)}</p>
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
			return "Anyone can see it, including non-members. This is the default setting.";
		case LeaderboardVisibility.MembersOnly:
			return "Only logged-in members of this server can see it.";
		case LeaderboardVisibility.ManagersOnly:
			return "Only people with Manage Messages, Manage Server, or Administrator permissions can see it.";
	}
}

interface EditLeaderboardVisibilityProps {
	readonly defaultValue: LeaderboardVisibility;
	readonly guildId: Snowflake;
}
