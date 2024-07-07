"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { Textarea } from "@/components/dashboard/Textarea.tsx";
import { DEFAULT_XP_MESSAGE, MAX_XP_MESSAGE_LENGTH, MIN_XP_MESSAGE_LENGTH } from "@/lib/guild-config.ts";
import type { Emoji, Role } from "@/lib/guild.ts";
import { RestartAlt } from "@mui/icons-material";
import { useState } from "react";
import { levelUpMessagePlaceholders } from "./level-up-message-placeholders.ts";

export function LevelUpMessage({ defaultValue, emojis, roles }: LevelUpMessageProps) {
	const [value, setValue] = useState(defaultValue ?? "");

	function handleReset() {
		setValue(DEFAULT_XP_MESSAGE);
	}

	return (
		<div className="flex max-w-3xl flex-col gap-2">
			<div className="flex items-center justify-between">
				<Label sub={`Max. ${MAX_XP_MESSAGE_LENGTH.toLocaleString("en")} chars`} htmlFor="xpMessage">
					Set the level up message to say something custom…
				</Label>

				<button
					className="flex items-center gap-2 rounded-lg bg-red px-2 py-1 text-shadow-regular transition-colors hover:bg-red/70"
					onClick={handleReset}
					type="button"
				>
					Reset
					<RestartAlt className="text-[#fff] drop-shadow-regular" />
				</button>
			</div>

			<Textarea
				id="xpMessage"
				emojis={emojis}
				max={MAX_XP_MESSAGE_LENGTH}
				min={MIN_XP_MESSAGE_LENGTH}
				roles={roles}
				placeholder="e.g. {user} has leveled up to **level {level}**!"
				placeholders={levelUpMessagePlaceholders}
				value={value}
				setValue={setValue}
			/>
		</div>
	);
}

interface LevelUpMessageProps {
	readonly defaultValue: string | null;
	readonly emojis: Emoji[];
	readonly roles: Role[];
}
