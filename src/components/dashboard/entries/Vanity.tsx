import type { AddChangeFn, GuildSettings } from "../../../contexts/GuildContext";
import { getDatabaseLimit } from "../../../utils/common";
import Field from "../../form/Field";
import Input from "../../form/Input";
import Label from "../../form/Label";
import Subtitle from "../../form/Subtitle";

interface VanityProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function Vanity({ addChange, settings }: VanityProps) {
	const vanityLimits = getDatabaseLimit("vanity", settings.premium);

	return (
		<Field>
			<Label
				htmlFor="vanity"
				name="Leaderboard Vanity URL"
				url="https://docs.pepemanager.com/guides/setting-a-leaderboard-vanity-url"
			/>
			<div className="max-w-md">
				<Input
					id="vanity"
					initialValue={settings.vanity ?? ""}
					maxLength={32}
					onChange={(text) => addChange("vanity", text)}
					placeholder="Enter the vanity used for the leveling leaderboard"
				/>
			</div>
			<Subtitle text={`Between ${vanityLimits.minLength} - ${vanityLimits.maxLength} characters.`} />
		</Field>
	);
}
