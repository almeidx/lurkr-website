"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { type PlaceholderValue, Textarea } from "@/components/dashboard/Textarea.tsx";
import { DEFAULT_XP_MESSAGE, MAX_XP_MESSAGE_LENGTH, MIN_XP_MESSAGE_LENGTH } from "@/lib/guild-config.ts";
import type { Emoji, Role } from "@/lib/guild.ts";
import { RestartAlt } from "@mui/icons-material";
import { useState } from "react";

const placeholders = [
	{ id: "{user}", name: "{user} • @user" },
	{ id: "{user.avatar}", name: "{user.avatar} • image url" },
	{ id: "{user.discriminator}", name: "{user.discriminator} • 0001" },
	{ id: "{user.id}", name: "{user.id} • 1234567890123456789" },
	{ id: "{user.tag}", name: "{user.tag} • user#0001 or user" },
	{ id: "{user.username}", name: "{user.username} • user" },
	{ id: "{guild.icon}", name: "{guild.icon} • image url" },
	{ id: "{guild.id}", name: "{guild.id} • 1234567890123456789" },
	{ id: "{guild.name}", name: "{guild.name} • Server name" },
	{ id: "{level}", name: "{level} • The new level" },
	{ id: "{xp}", name: "{xp} • The user's xp" },
] satisfies PlaceholderValue[];

export function LevelUpMessage({ defaultValue, emojis, premium, roles }: LevelUpMessageProps) {
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
				placeholders={placeholders}
				value={value}
				setValue={setValue}
			/>
		</div>
	);
}

interface LevelUpMessageProps {
	readonly defaultValue: string | null;
	readonly emojis: Emoji[];
	readonly premium: boolean;
	readonly roles: Role[];
}
