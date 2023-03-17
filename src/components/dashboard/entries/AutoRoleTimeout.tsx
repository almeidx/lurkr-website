import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { formatNumberToNDecimalPlaces, getDatabaseLimit, parseFloatStrict } from "~/utils/common";

interface AutoRoleTimeoutProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function AutoRoleTimeout({ addChange, settings }: AutoRoleTimeoutProps) {
	const autoRoleTimeoutLimits = getDatabaseLimit("autoRoleTimeout", settings.premium);

	return (
		<Field>
			<Label
				htmlFor="autoRoleTimeout"
				name="On Join Role Timer (Minutes)"
				url="https://docs.lurkr.gg/guides/automatically-added-roles-with-timeout#setting-your-timeout"
			/>
			<div className="max-w-md">
				<Input
					id="autoRoleTimeout"
					initialValue={settings.autoRoleTimeout ? formatNumberToNDecimalPlaces(settings.autoRoleTimeout / 60_000) : ""}
					maxLength={32}
					onChange={(text) => addChange("autoRoleTimeout", text ? parseFloatStrict(text) : null)}
					placeholder="Enter the autorole timeout"
				/>
			</div>
			<Subtitle
				text={`Between ${autoRoleTimeoutLimits.min / 60_000} - ${autoRoleTimeoutLimits.max / 60_000} minutes.`}
			/>
		</Field>
	);
}
