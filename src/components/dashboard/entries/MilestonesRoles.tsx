import type { GuildSettings, AddChangeFn, Role } from "../../../contexts/GuildContext";
import { getDatabaseLimit } from "../../../utils/common";
import type { Snowflake } from "../../../utils/constants";
import Field from "../../form/Field";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Subtitle from "../../form/Subtitle";

interface MilestonesRolesProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
}

export function MilestonesRoles({ addChange, roles, settings }: MilestonesRolesProps) {
	const milestonesRolesLimit = getDatabaseLimit("milestonesRoles", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="milestoneRoles"
				name="Milestone Reward Roles"
				url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
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
