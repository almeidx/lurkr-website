import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";
import { MAX_VANITY_LENGTH, MIN_VANITY_LENGTH } from "~/utils/guild-config";

interface VanityProps {
	readonly addChange: AddChangeFn;
	readonly settings: GuildSettings;
}

export function Vanity({ addChange, settings }: VanityProps) {
	return (
		<Field>
			<Label
				htmlFor="vanity"
				name="Leaderboard Vanity URL"
				url="https://docs.lurkr.gg/guides/setting-a-leaderboard-vanity-url"
			/>
			<div className="max-w-md">
				<Input
					id="vanity"
					initialValue={settings.vanity ?? ""}
					maxLength={MAX_VANITY_LENGTH}
					onChange={(text) => addChange("vanity", text)}
					placeholder="Enter the vanity used for the leveling leaderboard"
				/>
			</div>
			<Subtitle text={`Between ${MIN_VANITY_LENGTH} - ${MAX_VANITY_LENGTH} characters.`} />
		</Field>
	);
}
