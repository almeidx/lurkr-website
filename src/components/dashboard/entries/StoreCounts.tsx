import Field from "@/form/Field";
import Label from "@/form/Label";
import Toggle from "@/form/Toggle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";

interface StoreCountsProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function StoreCounts({ addChange, settings }: StoreCountsProps) {
	return (
		<Field direction="row">
			<div className="bg-discord-dark flex w-full flex-row items-center justify-between gap-x-3 rounded-lg p-2 pl-4">
				<Label
					htmlFor="storeCounts"
					name="Member Join/Leave Tracking"
					url="https://docs.lurkr.gg/config-commands/config/toggle"
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
