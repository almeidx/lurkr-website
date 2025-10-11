import { RadioProvider } from "@ariakit/react";
import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";

export function RoleMultiplierPriority({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<RadioProvider
			defaultValue={defaultValue.toString()}
			key={defaultValue.toString()} // Force remount when defaultValue changes
		>
			<RadioGroup className="flex w-fit flex-col gap-4">
				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="prioritiseMultiplierValue">
					<Radio id="prioritiseMultiplierValue" name="prioritiseMultiplierRoleHierarchy" rightMargin value="false" />
					Highest multiplier value
				</label>

				<label
					className="flex text-lg text-white/75 tracking-tight md:text-xl"
					htmlFor="prioritiseMultiplierRoleHierarchy"
				>
					<Radio
						id="prioritiseMultiplierRoleHierarchy"
						name="prioritiseMultiplierRoleHierarchy"
						rightMargin
						value="true"
					/>
					Highest role in the hierarchy
				</label>
			</RadioGroup>
		</RadioProvider>
	);
}
