import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { parseIntStrict } from "~/utils/common";
import { MAX_MILESTONES_INTERVAL, MIN_MILESTONES_INTERVAL } from "~/utils/guild-config";

interface MilestonesIntervalProps {
	readonly addChange: AddChangeFn;
	readonly settings: GuildSettings;
}

export function MilestonesInterval({ addChange, settings }: MilestonesIntervalProps) {
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
			<Subtitle text={`Between ${MIN_MILESTONES_INTERVAL} - ${MAX_MILESTONES_INTERVAL.toLocaleString("en")}.`} />
		</Field>
	);
}
