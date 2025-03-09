import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { RadioProvider } from "@ariakit/react";

export function RoleMultiplierPriority({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<RadioProvider defaultValue={defaultValue.toString()}>
			<RadioGroup className="flex w-fit flex-col gap-4">
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
		</RadioProvider>
	);
}
