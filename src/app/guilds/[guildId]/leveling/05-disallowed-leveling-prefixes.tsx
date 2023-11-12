import { CreatableList } from "@/components/dashboard/CreatableList.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { MAX_XP_DISALLOWED_PREFIXES, MAX_XP_DISALLOWED_PREFIXES_PREMIUM } from "@/lib/guild-config.ts";

export function DisallowedLevelingPrefixes({ defaultValues }: { readonly defaultValues: readonly string[] }) {
	return (
		<CreatableList
			defaultValues={defaultValues}
			inputId="disallowed-leveling-prefixes"
			placeholder="Type something and press enter, e.g. !"
			settingId="xpDisallowedPrefixes"
		>
			<Label sub={`Max. ${MAX_XP_DISALLOWED_PREFIXES} - Max. ${MAX_XP_DISALLOWED_PREFIXES_PREMIUM} for Premium`}>
				Prefixes
			</Label>
		</CreatableList>
	);
}
