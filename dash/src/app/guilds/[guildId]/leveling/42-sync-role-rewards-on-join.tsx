import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function SyncRoleRewardsOnJoin({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex gap-4">
			<Text
				docsPath="/guides/leveling-role-rewards#syncing-role-rewards-on-join"
				htmlFor="syncRoleRewardsOnJoin"
				tooltip="Choose if members should automatically receive their earned role rewards when they rejoin the server."
			>
				Automatically reassign role rewards to members when they rejoin the server?
			</Text>
			<Toggle id="syncRoleRewardsOnJoin" initialValue={defaultValue} />
		</div>
	);
}
