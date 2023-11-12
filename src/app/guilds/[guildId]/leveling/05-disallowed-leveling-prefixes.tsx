import { CreatableList } from "@/components/dashboard/CreatableList.tsx";

export function DisallowedLevelingPrefixes({ defaultValues }: { readonly defaultValues: readonly string[] }) {
	return (
		<CreatableList
			defaultValues={defaultValues}
			inputId="disallowed-leveling-prefixes"
			placeholder="Type something and press enter, e.g. !"
			settingId="xpDisallowedPrefixes"
		>
			<div className="flex items-end gap-2">
				<p className="text-lg tracking-tight text-white/75 md:text-xl">Prefixes</p>
				<p className="mb-1 text-xs font-light text-white/50">(Max. 10 - Max. 25 for Premium)</p>
			</div>
		</CreatableList>
	);
}
