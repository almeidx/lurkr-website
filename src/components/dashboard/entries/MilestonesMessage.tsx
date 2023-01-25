import type { GuildSettings, AddChangeFn } from "../../../contexts/GuildContext";
import { getDatabaseLimit } from "../../../utils/common";
import Field from "../../form/Field";
import Label from "../../form/Label";
import Subtitle from "../../form/Subtitle";
import Textarea from "../../form/Textarea";

interface MilestonesMessageProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function MilestonesMessage({ addChange, settings }: MilestonesMessageProps) {
	const milestonesMessageLimit = getDatabaseLimit("milestonesMessage", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="milestonesMessage"
				name="Milestone Announcement Message"
				url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-message"
			/>
			<Textarea
				id="milestonesMessage"
				initialText={settings.milestonesMessage ?? ""}
				maxLength={milestonesMessageLimit}
				onChange={(text) => addChange("milestonesMessage", text)}
				placeholder="Enter the milestone message"
			/>
			<Subtitle text={`Maximum of ${milestonesMessageLimit.toLocaleString("en")} characters.`} />
		</Field>
	);
}
