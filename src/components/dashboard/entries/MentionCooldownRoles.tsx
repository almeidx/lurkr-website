import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { Role, GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { getDatabaseLimit } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";

interface MentionCooldownRolesProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function MentionCooldownRoles({ addChange, roles, settings }: MentionCooldownRolesProps) {
	const mentionCooldownRolesLimit = getDatabaseLimit("mentionCooldownRoles", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="mentionCooldownRoles"
				name="Role Mention Cooldown Roles"
				url="https://docs.pepemanager.com/guides/automatic-role-mention-cooldown#setting-up-the-roles"
			/>
			<Selector
				id="mentionCooldownRoles"
				initialItems={(settings.mentionCooldownRoles as Snowflake[] | null) ?? []}
				items={roles}
				limit={mentionCooldownRolesLimit}
				onSelect={(roleIds) => addChange("mentionCooldownRoles", roleIds)}
				type="Role"
			/>
			<Subtitle text={`Maximum of ${mentionCooldownRolesLimit} roles.`} />
		</Field>
	);
}
