import { useContext, useEffect } from "react";
import { GuildContext, type Channel, type GuildSettings, type Role } from "../../../contexts/GuildContext";
import { getDatabaseLimit, parseIntStrict } from "../../../utils/common";
import type { Snowflake } from "../../../utils/constants";
import Field from "../../form/Field";
import Fieldset from "../../form/Fieldset";
import Input from "../../form/Input";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Subtitle from "../../form/Subtitle";
import Textarea from "../../form/Textarea";
import Header from "../Header";

interface MilestonesProps {
	channels: Channel[];
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}

export default function Milestones({ channels, settings, roles, openMenu }: MilestonesProps) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { addChange } = useContext(GuildContext);

	const milestonesIntervalLimits = getDatabaseLimit("milestonesInterval", settings.premium);
	const milestonesMessageLimit = getDatabaseLimit("milestonesMessage", settings.premium).maxLength;
	const milestonesRolesLimit = getDatabaseLimit("milestonesRoles", settings.premium).maxLength;

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
				description="Automatically announce member milestones in your server."
				id="milestones"
				initialValue={settings.storeMilestones}
				onChange={(state) => addChange("storeMilestones", state)}
				title="Milestones"
			/>

			<Fieldset>
				<Field>
					<Label
						htmlFor="milestonesChannel"
						name="Milestones Channel"
						url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-channel"
					/>
					<div className="max-w-[20rem]">
						<Selector
							id="milestonesChannel"
							initialItems={settings.milestonesChannel ? [settings.milestonesChannel] : []}
							items={channels}
							limit={1}
							onSelect={(channelIds) => addChange("milestonesChannel", channelIds[0] ?? null)}
							type="channel"
						/>
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="milestonesInterval"
						name="Milestones Interval"
						url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-interval"
					/>
					<div className="max-w-[20rem]">
						<Input
							id="milestonesInterval"
							initialValue={settings.milestonesInterval.toString()}
							maxLength={6}
							onChange={(text) => addChange("milestonesInterval", text ? parseIntStrict(text) : 0)}
							placeholder="Enter the milestones interval"
						/>
					</div>
					<Subtitle
						text={`Between ${milestonesIntervalLimits.min} - ${milestonesIntervalLimits.max.toLocaleString("en")}.`}
					/>
				</Field>

				<Field>
					<Label
						htmlFor="milestonesMessage"
						name="Milestone Message"
						url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-message"
					/>
					<Textarea
						initialText={settings.milestonesMessage ?? ""}
						id="milestonesMessage"
						maxLength={milestonesMessageLimit}
						onChange={(text) => addChange("milestonesMessage", text)}
						placeholder="Enter the milestone message"
					/>
					<Subtitle text={`Maximum of ${milestonesMessageLimit.toLocaleString("en")} characters.`} />
				</Field>

				<Field>
					<Label
						htmlFor="milestoneRoles"
						name="Milestone Roles"
						url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
					/>
					<Selector
						id="milestoneRoles"
						initialItems={(settings.milestonesRoles as Snowflake[] | null) ?? []}
						items={roles}
						limit={milestonesRolesLimit}
						onSelect={(roleIds) => addChange("milestonesRoles", roleIds)}
						type="role"
					/>
					<Subtitle text={`Maximum of ${milestonesRolesLimit} roles.`} />
				</Field>
			</Fieldset>
		</>
	);
}
