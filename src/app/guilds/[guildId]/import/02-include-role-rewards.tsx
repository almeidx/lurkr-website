import { Toggle } from "@/components/Toggle.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function IncludeRoleRewards() {
	return (
		<div className="flex gap-2">
			<Text>if you want to include role rewards:</Text>

			<Toggle id="includeRoleRewards" initialValue={false} />
		</div>
	);
}
