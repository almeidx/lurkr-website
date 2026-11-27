"use client";

import { toast } from "sonner";
import { Confirmation } from "@/components/Confirmation.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";
import { resetGuildDataAction } from "./actions.ts";

export function ResetGuildData({ guildId }: { readonly guildId: Snowflake }) {
	async function handleResetAllConfirm() {
		try {
			const result = await resetGuildDataAction(guildId);

			if (result.ok) {
				toast.success("Server data reset");
			} else {
				toast.error("Failed to reset server data", { description: result.error });
			}
		} catch (error) {
			toast.error(extractErrorMessage(error, "Failed to reset server data."));
		}
	}

	return (
		<Confirmation
			buttonText="Reset All"
			className="text-shadow-regular flex w-fit items-center gap-2 rounded-lg bg-red px-2 py-1 text-lg font-semibold md:text-xl"
			onConfirm={handleResetAllConfirm}
		>
			Are you sure you want to delete all of your server settings, leveling leaderboard, member counts insights, and
			milestones? <span className="font-bold text-red">This action is irreversible.</span>
		</Confirmation>
	);
}
