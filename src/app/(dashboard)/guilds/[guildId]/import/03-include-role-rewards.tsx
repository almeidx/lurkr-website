import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function IncludeRoleRewards() {
	return (
		<div className="flex gap-2">
			<Text>Include role rewards:</Text>

			<Toggle id="withRoleRewards" initialValue={false} />
		</div>
	);
}
