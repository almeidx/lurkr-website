"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { type PlaceholderValue, Textarea } from "@/components/dashboard/Textarea.tsx";
import { RestartAlt } from "@/components/icons/mdi/restart-alt.tsx";
import {
	DEFAULT_MILESTONES_MESSAGE,
	MAX_MILESTONES_MESSAGE_LENGTH,
	MIN_MILESTONES_MESSAGE_LENGTH,
} from "@/lib/guild-config.ts";
import type { Emoji, Role } from "@/lib/guild.ts";
import { useState } from "react";

const placeholders = [
	{ id: "{user}", name: "{user} • @user" },
	{ id: "{user.tag}", name: "{user.tag} • user#0000" },
	{ id: "{user.username}", name: "{user.name} • user" },
	{ id: "{user.discriminator}", name: "{user.discriminator} • 0000" },
	{ id: "{user.id}", name: "{user.id} • 1234567890123456789" },
	{ id: "{guild.name}", name: "{guild.name} • Server name" },
	{ id: "{guild.id}", name: "{guild.id} • 1234567890123456789" },
	{ id: "{milestone}", name: "{milestone} • 10000" },
] satisfies PlaceholderValue[];

export function MilestoneMessage({ defaultValue, emojis, premium, roles }: MilestoneMessageProps) {
	const [value, setValue] = useState(defaultValue ?? "");

	function handleReset() {
		setValue(DEFAULT_MILESTONES_MESSAGE);
	}

	return (
		<div className="flex max-w-3xl flex-col gap-2">
			<div className="flex items-center justify-between">
				<Label sub={`Max. ${MAX_MILESTONES_MESSAGE_LENGTH} chars`} htmlFor="milestonesMessage">
					Set the milestone message to say something custom…
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
				id="milestonesMessage"
				emojis={emojis}
				min={MIN_MILESTONES_MESSAGE_LENGTH}
				max={MAX_MILESTONES_MESSAGE_LENGTH}
				roles={roles}
				placeholder="e.g. {user} is the {milestone}th member!"
				placeholders={placeholders}
				value={value}
				setValue={setValue}
			/>
		</div>
	);
}

interface MilestoneMessageProps {
	readonly defaultValue: string | null;
	readonly emojis: Emoji[];
	readonly premium: boolean;
	readonly roles: Role[];
}
