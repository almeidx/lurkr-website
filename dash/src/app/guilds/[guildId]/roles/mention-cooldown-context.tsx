"use client";

import { createContext, type PropsWithChildren, use, useMemo, useState } from "react";
import type { Snowflake } from "@/utils/discord-cdn.ts";

interface MentionCooldownEdits {
	/** Whether the cooldown was set to 0 since the page loaded. */
	readonly isCooldownDisabled: boolean;
	/** The roles currently selected, or `null` if the selection wasn't touched. */
	readonly selectedRoleIds: readonly Snowflake[] | null;
	setIsCooldownDisabled(isCooldownDisabled: boolean): void;
	setSelectedRoleIds(selectedRoleIds: readonly Snowflake[]): void;
}

const MentionCooldownEditsContext = createContext<MentionCooldownEdits | null>(null);

/** Shares the unsaved mention cooldown changes between its inputs and the warnings about them. */
export function MentionCooldownEditsProvider({ children }: PropsWithChildren) {
	const [isCooldownDisabled, setIsCooldownDisabled] = useState(false);
	const [selectedRoleIds, setSelectedRoleIds] = useState<readonly Snowflake[] | null>(null);

	const value = useMemo(
		() => ({ isCooldownDisabled, selectedRoleIds, setIsCooldownDisabled, setSelectedRoleIds }),
		[isCooldownDisabled, selectedRoleIds],
	);

	return <MentionCooldownEditsContext value={value}>{children}</MentionCooldownEditsContext>;
}

export function useMentionCooldownEdits(): MentionCooldownEdits {
	const edits = use(MentionCooldownEditsContext);
	if (!edits) throw new Error("useMentionCooldownEdits must be used within a MentionCooldownEditsProvider");

	return edits;
}
