import type { AddChangeFn, GuildSettings } from "../../../contexts/GuildContext";
import { getDatabaseLimit } from "../../../utils/common";
import Field from "../../form/Field";
import Label from "../../form/Label";
import Subtitle from "../../form/Subtitle";
import Textarea from "../../form/Textarea";

interface XpMessageProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpMessage({ addChange, settings }: XpMessageProps) {
	const xpMessageLimit = getDatabaseLimit("xpMessage", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="xpMessage"
				name="Level Up Message"
				url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#customizing-the-level-up-message"
			/>
			<Textarea
				id="xpMessage"
				initialText={settings.xpMessage ?? ""}
				maxLength={xpMessageLimit}
				onChange={(text) => addChange("xpMessage", text)}
				placeholder="Enter the level up message"
			/>
			<Subtitle text={`Maximum of ${xpMessageLimit.toLocaleString("en")} characters.`} />
		</Field>
	);
}
