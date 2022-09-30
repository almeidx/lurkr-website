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

interface AutoroleProps {
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}

export default function Autorole({ settings, roles, openMenu }: AutoroleProps) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { addChange } = useContext(GuildContext);

	const autoRoleLimit = getDatabaseLimit("autoRole", settings.premium).maxLength;
	const autoRoleTimeoutLimits = getDatabaseLimit("autoRoleTimeout", settings.premium);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				openMenu={openMenu}
				description="Autoroles consist of roles that are given to users when they join the server."
				title="Autorole"
			/>

			<Fieldset>
				<Field>
					<Label
						htmlFor="autoRole"
						name="On Join Roles"
						url="https://docs.pepemanager.com/guides/automatically-added-roles-with-timeout"
					/>
					<Selector
						id="autoRole"
						limit={autoRoleLimit}
						initialItems={(settings.autoRole as Snowflake[] | null) ?? []}
						items={roles}
						onSelect={(roleIds) => addChange("autoRole", roleIds)}
						type="Role"
					/>
					<Subtitle text={`Maximum of ${autoRoleLimit} roles.`} />
				</Field>

				<Field>
					<Label
						htmlFor="autoRoleTimeout"
						name="On Join Role Timer (Minutes)"
						url="https://docs.pepemanager.com/guides/automatically-added-roles-with-timeout#setting-your-timeout"
					/>
					<div className="max-w-md">
						<Input
							id="autoRoleTimeout"
							initialValue={
								settings.autoRoleTimeout ? formatNumberToNDecimalPlaces(settings.autoRoleTimeout / 60_000) : ""
							}
							maxLength={32}
							onChange={(text) => addChange("autoRoleTimeout", text ? parseFloatStrict(text) : null)}
							placeholder="Enter the autorole timeout"
						/>
					</div>
					<Subtitle
						text={`Between ${autoRoleTimeoutLimits.min / 60_000} - ${autoRoleTimeoutLimits.max / 60_000} minutes.`}
					/>
				</Field>
			</Fieldset>
		</>
	);
}
