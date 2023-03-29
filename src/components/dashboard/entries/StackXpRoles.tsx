import Field from "@/form/Field";
import Label from "@/form/Label";
import Toggle from "@/form/Toggle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";

interface StackXpRolesProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function StackXpRoles({ addChange, settings }: StackXpRolesProps) {
	return (
		<Field direction="row">
			<div className="bg-discord-dark flex w-full flex-row items-center justify-between gap-x-3 rounded-lg p-2 pl-4">
				<Label
					htmlFor="stackXpRoles"
					name="Stack Leveling Role Rewards"
					url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#toggling-role-stacking"
					withMargin={false}
				/>
				<Toggle
					id="stackXpRoles"
					initialValue={settings.stackXpRoles}
					onChange={(state) => addChange("stackXpRoles", state)}
					size="small"
				/>
			</div>
		</Field>
	);
}
