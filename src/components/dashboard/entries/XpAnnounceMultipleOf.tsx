import { MAX_XP_ANNOUNCE_MULTIPLE_OF, MIN_XP_ANNOUNCE_MULTIPLE_OF } from "../../../utils/guild-config";
import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { parseIntStrict } from "~/utils/common";

interface XpAnnounceMultipleOfProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpAnnounceMultipleOf({ addChange, settings }: XpAnnounceMultipleOfProps) {
	return (
		<Field>
			<Label
				htmlFor="xpAnnounceMultipleOf"
				name="Factor for Leveling Announcements"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#when-to-send-the-level-up-message"
			/>
			<div className="max-w-md">
				<Input
					id="xpAnnounceMultipleOf"
					initialValue={settings.xpAnnounceMultipleOf?.toString() ?? ""}
					maxLength={3}
					onChange={(text) => addChange("xpAnnounceMultipleOf", text ? parseIntStrict(text) : null)}
					placeholder="Enter the factor for leveling announcements"
				/>
			</div>
			<Subtitle
				text={`Between ${MIN_XP_ANNOUNCE_MULTIPLE_OF} - ${MAX_XP_ANNOUNCE_MULTIPLE_OF.toLocaleString("en")}.`}
			/>
		</Field>
	);
}
