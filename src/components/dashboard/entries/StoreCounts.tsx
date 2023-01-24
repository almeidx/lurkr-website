import type { GuildSettings, GuildContextData } from "../../../contexts/GuildContext";
import Field from "../../form/Field";
import Label from "../../form/Label";
import Toggle from "../../form/Toggle";

interface StoreCountsProps {
	addChange: GuildContextData["addChange"];
	settings: GuildSettings;
}

export function StoreCounts({ addChange, settings }: StoreCountsProps) {
	return (
		<Field direction="row">
			<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
				<Label
					htmlFor="storeCounts"
					name="Member Join/Leave Tracking"
					url="https://docs.pepemanager.com/config-commands/config/toggle"
					withMargin={false}
				/>
				<Toggle
					id="storeCounts"
					initialValue={settings.storeCounts}
					onChange={(state) => addChange("storeCounts", state)}
					size="small"
				/>
			</div>
		</Field>
	);
}
