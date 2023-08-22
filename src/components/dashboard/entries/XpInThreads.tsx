import Field from "@/form/Field";
import Label from "@/form/Label";
import Toggle from "@/form/Toggle";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";

interface XpInThreadsProps {
	readonly addChange: AddChangeFn;
	readonly settings: GuildSettings;
}

export function XpInThreads({ addChange, settings }: XpInThreadsProps) {
	return (
		<Field direction="row">
			<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
				<Label
					htmlFor="xpInThreads"
					name="Leveling in Threads"
					url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#toggling-leveling-in-threads"
					withMargin={false}
				/>
				<Toggle
					id="xpInThreads"
					initialValue={settings.xpInThreads}
					onChange={(state) => addChange("xpInThreads", state)}
					size="small"
				/>
			</div>
		</Field>
	);
}
