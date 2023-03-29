import Field from "@/form/Field";
import Label from "@/form/Label";
import Toggle from "@/form/Toggle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";

interface PrioritiseMultiplierRoleHierarchyProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function PrioritiseMultiplierRoleHierarchy({ addChange, settings }: PrioritiseMultiplierRoleHierarchyProps) {
	return (
		<Field direction="row">
			<div className="bg-discord-dark flex w-full flex-row items-center justify-between gap-x-3 rounded-lg p-2 pl-4">
				<Label
					htmlFor="prioritiseMultiplierRoleHierarchy"
					name="Leveling Role Hierarchy/Multiplier Value Priority"
					url="https://docs.lurkr.gg/guides/setting-up-xp-multipliers#changing-role-multiplier-hierarchy"
					withMargin={false}
				/>
				<Toggle
					id="prioritiseMultiplierRoleHierarchy"
					initialValue={settings.prioritiseMultiplierRoleHierarchy}
					onChange={(state) => addChange("prioritiseMultiplierRoleHierarchy", state)}
					size="small"
				/>
			</div>
		</Field>
	);
}
