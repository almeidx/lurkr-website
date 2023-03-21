import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";
import { parseIntStrict } from "~/utils/common";
import { MAX_XP_ANNOUNCE_MINIMUM_LEVEL, MIN_XP_ANNOUNCE_MINIMUM_LEVEL } from "~/utils/guild-config";

interface XpAnnounceMinimumLevelProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpAnnounceMiniumLevel({ addChange, settings }: XpAnnounceMinimumLevelProps) {
	return (
		<Field>
			<Label
				htmlFor="xpAnnounceMinimumLevel"
				name="Minimum Leveling Announcement Threshold"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#when-to-send-the-level-up-message"
			/>
			<div className="max-w-md">
				<Input
					id="xpAnnounceMinimumLevel"
					initialValue={settings.xpAnnounceMinimumLevel.toString()}
					maxLength={6}
					onChange={(text) => addChange("xpAnnounceMinimumLevel", text ? parseIntStrict(text) : 0)}
					placeholder="Enter the minimum threshold for leveling announcements"
				/>
			</div>
			<Subtitle
				text={`Between ${MIN_XP_ANNOUNCE_MINIMUM_LEVEL} - ${MAX_XP_ANNOUNCE_MINIMUM_LEVEL.toLocaleString("en")}.`}
			/>
		</Field>
	);
}
