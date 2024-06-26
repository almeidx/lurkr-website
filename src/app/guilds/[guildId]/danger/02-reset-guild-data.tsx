"use client";

import { resetGuildDataAction } from "@/app/guilds/[guildId]/danger/actions.ts";
import { Confirmation } from "@/components/Confirmation.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function ResetGuildData({ guildId }: { readonly guildId: Snowflake }) {
	async function handleResetAllConfirm() {
		await resetGuildDataAction(guildId);
	}

	return (
		<Confirmation
			className="flex w-fit items-center gap-2 rounded-lg bg-red px-2 py-1 font-semibold text-lg text-shadow-regular md:text-xl"
			onConfirm={handleResetAllConfirm}
			buttonText="Reset All"
		>
			Are you sure you want to delete all of your server settings, leveling leaderboard, member counts insights, and
			milestones?
			<p className="font-bold text-red">This action is irreversible.</p>
		</Confirmation>
	);
}
