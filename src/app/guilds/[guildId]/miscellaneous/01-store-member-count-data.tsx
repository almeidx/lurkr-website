import { Toggle } from "@/components/Toggle.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function StoreMemberCountData({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text htmlFor="storeCounts" docsPath="/">
				Toggle member join/leave tracking for insight commands…
			</Text>

			<Toggle initialValue={defaultValue} id="storeCounts" />
		</div>
	);
}
