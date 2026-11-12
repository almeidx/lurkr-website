"use client";

import { Alert } from "@heroui/react";
import { useSaveNotice } from "@/components/dashboard/Form.tsx";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { useMentionCooldownEdits } from "./mention-cooldown-context.tsx";

/**
 * Warns about roles that are unmentionable because of the cooldown and would be, or just were, taken off it, as
 * those are left unmentionable.
 */
export function MentionCooldownWarnings({ mentionedRoleIds, roles, savedRoleIds }: MentionCooldownWarningsProps) {
	const { isCooldownDisabled, selectedRoleIds } = useMentionCooldownEdits();
	const saveNotice = useSaveNotice();

	// An untouched selector submits the saved roles it could find, which is not all of them if a role is missing
	// from `roles`.
	const submittedRoleIds = selectedRoleIds ?? savedRoleIds.filter((roleId) => roles.some((role) => role.id === roleId));

	// Roles on cooldown that saving would take off it.
	const affectedRoleIds = mentionedRoleIds.filter(
		(roleId) => savedRoleIds.includes(roleId) && (isCooldownDisabled || !submittedRoleIds.includes(roleId)),
	);

	return (
		<>
			<UnmentionableRolesWarning
				description="If you save this change, Lurkr will not make {them} mentionable again. You will have to do it in your server's role settings."
				roleIds={affectedRoleIds}
				roles={roles}
				title="currently unmentionable because of the cooldown"
			/>

			<UnmentionableRolesWarning
				description="Lurkr will not make {them} mentionable again. You can do it in your server's role settings."
				roleIds={saveNotice?.untrackedMentionedRoleIds ?? []}
				roles={roles}
				title="no longer on cooldown, but still unmentionable"
			/>
		</>
	);
}

function UnmentionableRolesWarning({ description, roleIds, roles, title }: UnmentionableRolesWarningProps) {
	const names = roleIds.flatMap((roleId) => roles.find((role) => role.id === roleId)?.name ?? []);

	// Without any cached roles, ids can't be told apart from deleted roles, so they are still counted.
	// Otherwise, a role that can't be found was deleted and has nothing to warn about.
	const unknownCount = roles.length ? 0 : roleIds.length;

	if (!names.length && !unknownCount) return null;

	const subject = names.length
		? names.map((name) => `@${name}`).join(", ")
		: `${unknownCount} role${unknownCount === 1 ? "" : "s"}`;
	const isPlural = names.length ? names.length > 1 : unknownCount > 1;

	return (
		<Alert status="warning">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>
					{subject} {isPlural ? "are" : "is"} {title}
				</Alert.Title>
				<Alert.Description>{description.replace("{them}", isPlural ? "them" : "it")}</Alert.Description>
			</Alert.Content>
		</Alert>
	);
}

interface MentionCooldownWarningsProps {
	/** Roles currently unmentionable due to the cooldown. */
	readonly mentionedRoleIds: Snowflake[];
	readonly roles: Role[];
	/** The roles saved as having the cooldown. */
	readonly savedRoleIds: Snowflake[];
}

interface UnmentionableRolesWarningProps {
	/** `{them}` is replaced with "it" or "them", depending on the number of roles. */
	readonly description: string;
	readonly roleIds: readonly Snowflake[];
	readonly roles: Role[];
	readonly title: string;
}
