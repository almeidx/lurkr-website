"use client";

import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";

export function StackRoleRewards({ defaultValue }: { readonly defaultValue: boolean }) {
	const radio = useRadioStore({ defaultValue: defaultValue.toString() });

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex text-lg tracking-tight text-white/75 md:text-xl">
				<Radio value="true" id="stackXpRoles" name="stackXpRoles" rightMargin />
				Keep previous rewards
			</label>

			<label className="flex text-lg tracking-tight text-white/75 md:text-xl">
				<Radio value="false" id="stackXpRoles" name="stackXpRoles" rightMargin />
				Remove previous rewards
			</label>
		</RadioGroup>
	);
}
