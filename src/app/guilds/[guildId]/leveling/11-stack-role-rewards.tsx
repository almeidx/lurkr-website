import { Toggle } from "@/components/Toggle.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function StackRoleRewards({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text htmlFor="xpInThreads" docsPath="/guides/setting-up-server-leveling#toggling-role-stacking">
				Toggle role rewards stacking?{" "}
			</Text>

			<Toggle initialValue={defaultValue} id="stackXpRoles" />
		</div>
	);
}
