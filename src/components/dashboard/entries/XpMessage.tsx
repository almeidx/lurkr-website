import Field from "@/form/Field";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import Textarea from "@/form/Textarea";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";
import { MAX_XP_MESSAGE_LENGTH } from "~/utils/guild-config";

interface XpMessageProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpMessage({ addChange, settings }: XpMessageProps) {
	return (
		<Field>
			<Label
				htmlFor="xpMessage"
				name="Level Up Message"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#customizing-the-level-up-message"
			/>
			<Textarea
				id="xpMessage"
				initialText={settings.xpMessage ?? ""}
				maxLength={MAX_XP_MESSAGE_LENGTH}
				onChange={(text) => addChange("xpMessage", text)}
				placeholder="Enter the level up message"
			/>
			<Subtitle text={`Maximum of ${MAX_XP_MESSAGE_LENGTH.toLocaleString("en")} characters.`} />
		</Field>
	);
}
