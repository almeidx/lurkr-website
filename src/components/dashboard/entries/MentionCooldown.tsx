import type { AddChangeFn, GuildSettings } from "../../../contexts/GuildContext";
import { formatNumberToNDecimalPlaces, getDatabaseLimit, parseFloatStrict } from "../../../utils/common";
import Field from "../../form/Field";
import Input from "../../form/Input";
import Label from "../../form/Label";
import Subtitle from "../../form/Subtitle";

interface MentionCooldownProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function MentionCooldown({ addChange, settings }: MentionCooldownProps) {
	const mentionCooldownLimits = getDatabaseLimit("mentionCooldown", settings.premium);

	return (
		<Field>
			<Label
				htmlFor="mentionCooldown"
				name="Role Mention Cooldown Time (Minutes)"
				url="https://docs.pepemanager.com/guides/automatic-role-mention-cooldown#setting-up-the-cooldown-time"
			/>
			<div className="max-w-md">
				<Input
					id="mentionCooldown"
					initialValue={formatNumberToNDecimalPlaces(settings.mentionCooldown ? settings.mentionCooldown / 60_000 : 0)}
					maxLength={5}
					onChange={(text) => addChange("mentionCooldown", parseFloatStrict(text))}
					placeholder="Enter the role mention cooldown"
				/>
			</div>
			<Subtitle
				text={`Between ${mentionCooldownLimits.min / 60_000} - ${mentionCooldownLimits.max / 60_000} minutes.`}
			/>
		</Field>
	);
}
