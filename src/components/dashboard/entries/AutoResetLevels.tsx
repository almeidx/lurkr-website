import { AutoResetLevelsEnum, type GuildSettings, type AddChangeFn } from "../../../contexts/GuildContext";
import BasicSelect from "../../form/BasicSelect";
import Field from "../../form/Field";
import Label from "../../form/Label";

interface AutoResetLevelsProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function AutoResetLevels({ addChange, settings }: AutoResetLevelsProps) {
	return (
		<Field>
			<Label
				htmlFor="autoResetLevels"
				name="Automatic Level Resets"
				url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#automatically-resetting-levels"
			/>
			<div className="max-w-md">
				<BasicSelect
					closeOnSelect
					initialItem={resolveAutoResetLevelsNameByType(settings.autoResetLevels)}
					items={["None", "Leave", "Ban", "Ban & Leave"]}
					onSelect={(option) => addChange("autoResetLevels", resolveAutoResetLevelsTypeByName(option))}
				/>
			</div>
		</Field>
	);
}

function resolveAutoResetLevelsNameByType(type: AutoResetLevelsEnum) {
	// TODO: Refactor this
	return type === AutoResetLevelsEnum.Ban
		? "Ban"
		: type === AutoResetLevelsEnum.Leave
		? "Leave"
		: type === AutoResetLevelsEnum.Both
		? "Ban & Leave"
		: "None";
}

function resolveAutoResetLevelsTypeByName(name: string) {
	// TODO: Refactor this
	return name === "Ban & Leave"
		? AutoResetLevelsEnum.Both
		: name === "Ban"
		? AutoResetLevelsEnum.Ban
		: name === "Leave"
		? AutoResetLevelsEnum.Leave
		: AutoResetLevelsEnum.None;
}
