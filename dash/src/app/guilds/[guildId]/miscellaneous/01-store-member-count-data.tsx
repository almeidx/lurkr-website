import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function StoreMemberCountData({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex items-center gap-4">
			<Text
				docsPath="/utility-commands/member-graph#description"
				htmlFor="storeCounts"
				tooltip="Toggles whether Lurkr will track how many members join and leave your server. This allows commands like /graph and /growthchange to work."
			>
				Enable member join/leave tracking for insight commands…
			</Text>

			<Toggle id="storeCounts" initialValue={defaultValue} />
		</div>
	);
}
