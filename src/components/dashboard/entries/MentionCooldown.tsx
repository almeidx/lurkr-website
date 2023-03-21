import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";
import { formatNumberToNDecimalPlaces, parseFloatStrict } from "~/utils/common";
import { MAX_MENTION_COOLDOWN, MIN_MENTION_COOLDOWN } from "~/utils/guild-config";

interface MentionCooldownProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function MentionCooldown({ addChange, settings }: MentionCooldownProps) {
	return (
		<Field>
			<Label
				htmlFor="mentionCooldown"
				name="Role Mention Cooldown Time (Minutes)"
				url="https://docs.lurkr.gg/guides/automatic-role-mention-cooldown#setting-up-the-cooldown-time"
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
			<Subtitle text={`Between ${MIN_MENTION_COOLDOWN / 60_000} - ${MAX_MENTION_COOLDOWN / 60_000} minutes.`} />
		</Field>
	);
}
