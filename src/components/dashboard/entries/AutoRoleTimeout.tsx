import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { GuildSettings, AddChangeFn } from "~/contexts/GuildContext";
import { formatNumberToNDecimalPlaces } from "~/utils/common";
import { MAX_AUTO_ROLE_TIMEOUT, MIN_AUTO_ROLE_TIMEOUT } from "~/utils/guild-config";

interface AutoRoleTimeoutProps {
	readonly addChange: AddChangeFn;
	readonly settings: GuildSettings;
}

export function AutoRoleTimeout({ addChange, settings }: AutoRoleTimeoutProps) {
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
					onChange={(text) => addChange("autoRoleTimeout", text ? Number(text) : null)}
					placeholder="Enter the autorole timeout"
				/>
			</div>
			<Subtitle text={`Between ${MIN_AUTO_ROLE_TIMEOUT / 60_000} - ${MAX_AUTO_ROLE_TIMEOUT / 60_000} minutes.`} />
		</Field>
	);
}
