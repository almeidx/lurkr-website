import { useContext, useEffect } from "react";
import { GuildContext } from "../../../contexts/GuildContext";
import type { DashboardDatabaseGuild, DashboardRoles } from "../../../graphql/queries/DashboardGuild";
import type { Snowflake } from "../../../utils/constants";
import { formatNumberToNDecimalPlaces, getDatabaseLimit, parseFloatStrict } from "../../../utils/utils";
import Field from "../../form/Field";
import Fieldset from "../../form/Fieldset";
import Input from "../../form/Input";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Subtitle from "../../form/Subtitle";
import Header from "../Header";

interface MentionCooldownProps {
	database: DashboardDatabaseGuild;
	openMenu(): void;
	roles: DashboardRoles;
}

export default function MentionCooldown({ database, roles, openMenu }: MentionCooldownProps) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { addChange } = useContext(GuildContext);

	const mentionCooldownLimits = getDatabaseLimit("mentionCooldown", database.premium);
	const mentionCooldownRolesLimit = getDatabaseLimit("mentionCooldownRoles", database.premium).maxLength;

	useEffect(() => {
		window.scroll({
			behavior: "auto",
			left: 0,
			top: 0,
		});
	}, [openMenu]);

	return (
		<>
			<Header
				openMenu={openMenu}
				description="Automatically make roles non-mentionable after being mentioned for a certain amount of time."
				title="Mention Cooldown"
			/>

			<Fieldset>
				<Field>
					<Label
						htmlFor="mentionCooldown"
						name="Mention Cooldown (Minutes)"
						url="https://docs.pepemanager.com/guides/automatic-role-mention-cooldown#setting-up-the-cooldown-time"
					/>
					<div className="max-w-[20rem]">
						<Input
							id="mentionCooldown"
							initialValue={formatNumberToNDecimalPlaces(database.mentionCooldown / 60_000)}
							maxLength={5}
							onChange={(text) => addChange("mentionCooldown", parseFloatStrict(text))}
							placeholder="Enter the role mention cooldown"
						/>
					</div>
					<Subtitle
						text={`Between ${mentionCooldownLimits.min / 60_000} - ${mentionCooldownLimits.max / 60_000} minutes.`}
					/>
				</Field>

				<Field>
					<Label
						htmlFor="mentionCooldownRoles"
						name="Mention Cooldown Roles"
						url="https://docs.pepemanager.com/guides/automatic-role-mention-cooldown#setting-up-the-roles"
					/>
					<Selector
						id="mentionCooldownRoles"
						limit={mentionCooldownRolesLimit}
						initialItems={(database.mentionCooldownRoles as Snowflake[] | null) ?? []}
						items={roles}
						onSelect={(roleIds) => addChange("mentionCooldownRoles", roleIds)}
						type="role"
					/>
					<Subtitle text={`Maximum of ${mentionCooldownRolesLimit} roles.`} />
				</Field>
			</Fieldset>
		</>
	);
}
