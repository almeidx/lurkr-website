import { CreatableList } from "@/components/dashboard/CreatableList.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";

export function DisallowedLevelingPrefixes({ defaultValues, premium }: DisallowedLevelingPrefixesProps) {
	return (
		<CreatableList
			defaultValues={defaultValues}
			inputId="disallowed-leveling-prefixes"
			max={limitFor("xpDisallowedPrefixes", premium)}
			placeholder="Type something and press enter, e.g. !"
			settingId="xpDisallowedPrefixes"
		>
			<Label sub={limitLabel("xpDisallowedPrefixes")}>Prefixes</Label>
		</CreatableList>
	);
}

interface DisallowedLevelingPrefixesProps {
	readonly defaultValues: readonly string[];
	readonly premium: boolean;
}
