"use client";

import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";

export function RoleMultiplierPriority({ defaultValue }: { readonly defaultValue: boolean }) {
	const radio = useRadioStore({ defaultValue: defaultValue.toString() });

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="prioritiseMultiplierValue">
				<Radio value="false" id="prioritiseMultiplierValue" name="prioritiseMultiplierRoleHierarchy" rightMargin />
				Highest multiplier value
			</label>

			<label
				className="flex text-lg text-white/75 tracking-tight md:text-xl"
				htmlFor="prioritiseMultiplierRoleHierarchy"
			>
				<Radio
					value="true"
					id="prioritiseMultiplierRoleHierarchy"
					name="prioritiseMultiplierRoleHierarchy"
					rightMargin
				/>
				Highest role in the hierarchy
			</label>
		</RadioGroup>
	);
}
