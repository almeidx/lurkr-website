import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { getDatabaseLimit, parseIntStrict } from "~/utils/common";

interface XpAnnounceMultipleOfProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpAnnounceMultipleOf({ addChange, settings }: XpAnnounceMultipleOfProps) {
	const xpAnnounceMultipleOfLimits = getDatabaseLimit("xpAnnounceMultipleOf", settings.premium);

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
					initialValue={settings.xpAnnounceMultipleOf?.toString() ?? "1"}
					maxLength={6}
					onChange={(text) => addChange("xpAnnounceMultipleOf", text ? parseIntStrict(text) : 0)}
					placeholder="Enter the factor for leveling announcements"
				/>
			</div>
			<Subtitle
				text={`Between ${xpAnnounceMultipleOfLimits.min} - ${xpAnnounceMultipleOfLimits.max.toLocaleString("en")}.`}
			/>
		</Field>
	);
}
