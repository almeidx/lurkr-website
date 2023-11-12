"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { type PlaceholderValue, Textarea } from "@/components/dashboard/Textarea.tsx";
import { DEFAULT_XP_MESSAGE, MAX_XP_MESSAGE_LENGTH } from "@/lib/guild-config.ts";
import type { Emoji, Role } from "@/lib/guild.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { RiRestartLine } from "@react-icons/all-files/ri/RiRestartLine";
import { useState } from "react";

const placeholders = [
	{ id: "{user}", name: "{user} • @user" },
	{ id: "{user.tag}", name: "{user.tag} • user#0000" },
	{ id: "{user.username}", name: "{user.name} • user" },
	{ id: "{user.discriminator}", name: "{user.discriminator} • 0000" },
	{ id: "{user.id}", name: "{user.id} • 1234567890123456789" },
	{ id: "{guild.name}", name: "{guild.name} • Server name" },
	{ id: "{guild.id}", name: "{guild.id} • 1234567890123456789" },
	{ id: "{level}", name: "{level} • The new level" },
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
					className="flex items-center gap-2 rounded-lg bg-red px-2 py-1 transition-colors text-shadow-regular hover:bg-red/70"
					onClick={handleReset}
					type="button"
				>
					Reset
					<RiRestartLine color="#fff" className="drop-shadow-regular" />
				</button>
			</div>

			<Textarea
				id="xpMessage"
				emojis={emojis}
				max={getMaximumLimit("xpMessage", premium)}
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
