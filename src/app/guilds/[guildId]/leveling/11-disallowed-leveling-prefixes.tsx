import { CreatableList } from "@/components/dashboard/CreatableList.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { MAX_XP_DISALLOWED_PREFIXES, MAX_XP_DISALLOWED_PREFIXES_PREMIUM } from "@/lib/guild-config.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";

export function DisallowedLevelingPrefixes({ defaultValues, premium }: DisallowedLevelingPrefixesProps) {
	const max = getMaximumLimit("xpDisallowedPrefixes", premium);

	return (
		<CreatableList
			defaultValues={defaultValues}
			inputId="disallowed-leveling-prefixes"
			max={max}
			placeholder="Type something and press enter, e.g. !"
			settingId="xpDisallowedPrefixes"
		>
			<Label sub={`Max. ${MAX_XP_DISALLOWED_PREFIXES} - Max. ${MAX_XP_DISALLOWED_PREFIXES_PREMIUM} for Premium`}>
				Prefixes
			</Label>
		</CreatableList>
	);
}

interface DisallowedLevelingPrefixesProps {
	readonly defaultValues: readonly string[];
	readonly premium: boolean;
}
