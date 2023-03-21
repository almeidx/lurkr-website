import Field from "@/form/Field";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import Textarea from "@/form/Textarea";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { MAX_MILESTONES_MESSAGE_LENGTH, MIN_MILESTONES_MESSAGE_LENGTH } from "~/utils/guild-config";

interface MilestonesMessageProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function MilestonesMessage({ addChange, settings }: MilestonesMessageProps) {
	return (
		<Field>
			<Label
				htmlFor="milestonesMessage"
				name="Milestone Announcement Message"
				url="https://docs.lurkr.gg/guides/automatically-controlled-member-milestones#setting-the-milestones-message"
			/>
			<Textarea
				id="milestonesMessage"
				initialText={settings.milestonesMessage ?? ""}
				maxLength={MAX_MILESTONES_MESSAGE_LENGTH}
				onChange={(text) => addChange("milestonesMessage", text)}
				placeholder="Enter the milestone message"
			/>
			<Subtitle
				text={`Between ${MIN_MILESTONES_MESSAGE_LENGTH} - ${MAX_MILESTONES_MESSAGE_LENGTH.toLocaleString(
					"en",
				)} characters.`}
			/>
		</Field>
	);
}
