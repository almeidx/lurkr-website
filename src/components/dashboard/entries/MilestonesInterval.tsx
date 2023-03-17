import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { getDatabaseLimit, parseIntStrict } from "~/utils/common";

interface MilestonesIntervalProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function MilestonesInterval({ addChange, settings }: MilestonesIntervalProps) {
	const milestonesIntervalLimits = getDatabaseLimit("milestonesInterval", settings.premium);

	return (
		<Field>
			<Label
				htmlFor="milestonesInterval"
				name="Milestone Announcement Interval"
				url="https://docs.lurkr.gg/guides/automatically-controlled-member-milestones#setting-the-milestones-interval"
			/>
			<div className="max-w-md">
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
	);
}
