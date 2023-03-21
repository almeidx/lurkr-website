import { MAX_MENTION_COOLDOWN_ROLES } from "../../../utils/guild-config";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { Role, GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import type { Snowflake } from "~/utils/constants";

interface MentionCooldownRolesProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function MentionCooldownRoles({ addChange, roles, settings }: MentionCooldownRolesProps) {
	return (
		<Field>
			<Label
				htmlFor="mentionCooldownRoles"
				name="Role Mention Cooldown Roles"
				url="https://docs.lurkr.gg/guides/automatic-role-mention-cooldown#setting-up-the-roles"
			/>
			<Selector
				id="mentionCooldownRoles"
				initialItems={(settings.mentionCooldownRoles as Snowflake[] | null) ?? []}
				items={roles}
				limit={MAX_MENTION_COOLDOWN_ROLES}
				onSelect={(roleIds) => addChange("mentionCooldownRoles", roleIds)}
				type="Role"
			/>
			<Subtitle text={`Maximum of ${MAX_MENTION_COOLDOWN_ROLES} roles.`} />
		</Field>
	);
}
