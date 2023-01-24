import type { Channel, GuildSettings, AddChangeFn } from "../../../contexts/GuildContext";
import Field from "../../form/Field";
import Label from "../../form/Label";
import Selector from "../../form/Selector";

interface MilestonesChannelProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

export function MilestonesChannel({ addChange, channels, settings }: MilestonesChannelProps) {
	return (
		<Field>
			<Label
				htmlFor="milestonesChannel"
				name="Milestone Channel"
				url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-channel"
			/>
			<div className="max-w-md">
				<Selector
					id="milestonesChannel"
					initialItems={settings.milestonesChannel ? [settings.milestonesChannel] : []}
					items={channels}
					limit={1}
					onSelect={(channelIds) => addChange("milestonesChannel", channelIds[0] ?? null)}
					type="Channel"
				/>
			</div>
		</Field>
	);
}
