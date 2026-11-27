import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";

export function RoleMultiplierPriority({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<RadioGroup
			aria-label="Role multiplier priority"
			className="w-fit gap-4"
			defaultValue={defaultValue.toString()}
			key={defaultValue.toString()}
			name="prioritiseMultiplierRoleHierarchy"
		>
			<Radio value="false">Highest multiplier value</Radio>
			<Radio value="true">Highest role in the hierarchy</Radio>
		</RadioGroup>
	);
}
