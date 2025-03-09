import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { RadioProvider } from "@ariakit/react";

export function StackRoleRewards({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<RadioProvider defaultValue={defaultValue.toString()}>
			<RadioGroup className="flex w-fit flex-col gap-4">
				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="stackXpRolesKeep">
					<Radio value="true" id="stackXpRolesKeep" name="stackXpRoles" rightMargin />
					Keep previous rewards
				</label>

				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="stackXpRolesRemove">
					<Radio value="false" id="stackXpRolesRemove" name="stackXpRoles" rightMargin />
					Remove previous rewards
				</label>
			</RadioGroup>
		</RadioProvider>
	);
}
