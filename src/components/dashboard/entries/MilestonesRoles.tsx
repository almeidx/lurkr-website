import { MAX_MILESTONES_ROLES, MAX_MILESTONES_ROLES_PREMIUM } from "../../../utils/guild-config";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn, Role } from "~/contexts/GuildContext";
import type { Snowflake } from "~/utils/constants";

interface MilestonesRolesProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function MilestonesRoles({ addChange, roles, settings }: MilestonesRolesProps) {
	const milestonesRolesLimit = settings.premium ? MAX_MILESTONES_ROLES_PREMIUM : MAX_MILESTONES_ROLES;

	return (
		<Field>
			<Label
				htmlFor="milestoneRoles"
				name="Milestone Reward Roles"
				url="https://docs.lurkr.gg/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
			/>
			<Selector
				id="milestoneRoles"
				initialItems={(settings.milestonesRoles as Snowflake[] | null) ?? []}
				items={roles}
				limit={milestonesRolesLimit}
				onSelect={(roleIds) => addChange("milestonesRoles", roleIds)}
				type="Role"
			/>
			<Subtitle text={`Maximum of ${milestonesRolesLimit} roles.`} />
		</Field>
	);
}
