"use client";

import { Alert } from "@heroui/react";
import { useState } from "react";
import { useSaveNotice } from "@/components/dashboard/Form.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { MAX_MENTION_COOLDOWN_ROLES } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function MentionCooldownRoles({ defaultValues, mentionedRoleIds, premium, roles }: MentionCooldownRolesProps) {
	const defaultValue = mapRoleIdsToRoles(defaultValues, roles);

	const [selectedRoleIds, setSelectedRoleIds] = useState<readonly Snowflake[]>(defaultValues);
	const saveNotice = useSaveNotice();

	// Roles on cooldown that the pending changes would take off it.
	const removedMentionedRoleIds = mentionedRoleIds.filter(
		(roleId) => defaultValues.includes(roleId) && !selectedRoleIds.includes(roleId),
	);

	return (
		<>
			<RoleSelector
				defaultValues={defaultValue}
				inputId="mention-cooldown-roles"
				max={getMaximumLimit("mentionCooldownRoles", premium)}
				onChange={(newValues) => setSelectedRoleIds(newValues.map(({ id }) => id))}
				roles={roles}
				settingId="mentionCooldownRoles"
			>
				<Label sub={`Max. ${MAX_MENTION_COOLDOWN_ROLES}`}>Roles</Label>
			</RoleSelector>

			<UnmentionableRolesWarning
				description="If you save this change, Lurkr will not make {them} mentionable again. You will have to do it in your server's role settings."
				roleIds={removedMentionedRoleIds}
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

interface MentionCooldownRolesProps {
	readonly defaultValues: Snowflake[];
	/** Roles currently unmentionable due to the cooldown. */
	readonly mentionedRoleIds: Snowflake[];
	readonly premium: boolean;
	readonly roles: Role[];
}

interface UnmentionableRolesWarningProps {
	/** `{them}` is replaced with "it" or "them", depending on the number of roles. */
	readonly description: string;
	readonly roleIds: readonly Snowflake[];
	readonly roles: Role[];
	readonly title: string;
}
