"use client";

import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";

export function StackRoleRewards({ defaultValue }: { readonly defaultValue: boolean }) {
	const radio = useRadioStore({ defaultValue: defaultValue.toString() });

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="stackXpRolesKeep">
				<Radio value="true" id="stackXpRolesKeep" name="stackXpRoles" rightMargin />
				Keep previous rewards
			</label>

			<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="stackXpRolesRemove">
				<Radio value="false" id="stackXpRolesRemove" name="stackXpRoles" rightMargin />
				Remove previous rewards
			</label>
		</RadioGroup>
	);
}
