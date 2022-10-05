import { useContext, useEffect } from "react";
import { GuildContext, type GuildSettings, type Role } from "../../../contexts/GuildContext";
import { formatNumberToNDecimalPlaces, getDatabaseLimit, parseFloatStrict } from "../../../utils/common";
import type { Snowflake } from "../../../utils/constants";
import Field from "../../form/Field";
import Fieldset from "../../form/Fieldset";
import Input from "../../form/Input";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Subtitle from "../../form/Subtitle";
import Header from "../Header";

interface MentionCooldownProps {
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}

export default function MentionCooldown({ settings, roles, openMenu }: MentionCooldownProps) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { addChange } = useContext(GuildContext);

	const mentionCooldownLimits = getDatabaseLimit("mentionCooldown", settings.premium);
	const mentionCooldownRolesLimit = getDatabaseLimit("mentionCooldownRoles", settings.premium).maxLength;

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Automatically make roles non-mentionable after being mentioned for a certain amount of time."
				openMenu={openMenu}
				title="Mention Cooldown"
			/>

			<Fieldset>
				<Field>
					<Label
						htmlFor="mentionCooldown"
						name="Role Mention Cooldown Time (Minutes)"
						url="https://docs.pepemanager.com/guides/automatic-role-mention-cooldown#setting-up-the-cooldown-time"
					/>
					<div className="max-w-md">
						<Input
							id="mentionCooldown"
							initialValue={formatNumberToNDecimalPlaces(
								settings.mentionCooldown ? settings.mentionCooldown / 60_000 : 0,
							)}
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
			</Fieldset>
		</>
	);
}
