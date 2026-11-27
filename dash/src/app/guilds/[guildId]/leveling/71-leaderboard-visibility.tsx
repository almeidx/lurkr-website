"use client";

import { Label, ListBox, Select } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { LeaderboardVisibility } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

const ITEM_CLASS_NAME = "rounded-lg text-base data-focus-visible:bg-white/10 data-hovered:bg-white/5";

export function EditLeaderboardVisibility({ defaultValue, guildId, nsfw }: EditLeaderboardVisibilityProps) {
	const initialValue =
		nsfw && defaultValue === LeaderboardVisibility.Public ? LeaderboardVisibility.MembersOnly : defaultValue;

	return (
		// `key` is required here to prevent rollback to previous setting after saving
		<LeaderboardVisibilitySelect guildId={guildId} initialValue={initialValue} key={initialValue} nsfw={nsfw} />
	);
}

function LeaderboardVisibilitySelect({ guildId, initialValue, nsfw }: LeaderboardVisibilitySelectProps) {
	const [value, setValue] = useState(initialValue);

	return (
		<div className="flex flex-col gap-2">
			<Select
				className="gap-2"
				onChange={(key) => {
					if (key) setValue(key as LeaderboardVisibility);
				}}
				value={value}
			>
				{/* Submitted from here, as the form reset that follows a save empties the select element of `Select` */}
				<input name="leaderboardVisibility" type="hidden" value={value} />

				<Label className="text-lg font-normal tracking-tight text-white/75 md:text-xl">
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
				</Label>

				<Select.Trigger className="h-10 w-56 items-center rounded-lg border-0 bg-light-gray shadow-dim-inner">
					<Select.Value className="text-base sm:text-base" />
					<Select.Indicator />
				</Select.Trigger>

				<Select.Popover className="rounded-lg bg-light-gray shadow-dim-inner">
					<ListBox>
						<ListBox.Item
							className={ITEM_CLASS_NAME}
							id={LeaderboardVisibility.Public}
							isDisabled={nsfw}
							textValue="Public"
						>
							Public
							<ListBox.ItemIndicator />
						</ListBox.Item>
						<ListBox.Item className={ITEM_CLASS_NAME} id={LeaderboardVisibility.MembersOnly} textValue="Members-only">
							Members-only
							<ListBox.ItemIndicator />
						</ListBox.Item>
						<ListBox.Item className={ITEM_CLASS_NAME} id={LeaderboardVisibility.ManagersOnly} textValue="Managers-only">
							Managers-only
							<ListBox.ItemIndicator />
						</ListBox.Item>
					</ListBox>
				</Select.Popover>
			</Select>

			<p className="text-white/75">{getSubtitle(value)}</p>

			{nsfw ? (
				<p className="text-white/75">
					This server is flagged as age-restricted (NSFW) by Discord, so its web leaderboard cannot be public.
				</p>
			) : null}
		</div>
	);
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

interface LeaderboardVisibilitySelectProps {
	readonly guildId: Snowflake;
	readonly initialValue: LeaderboardVisibility;
	readonly nsfw: boolean;
}
