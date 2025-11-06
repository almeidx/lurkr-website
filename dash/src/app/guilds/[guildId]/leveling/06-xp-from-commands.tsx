import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function XpFromCommands({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text
				docsPath="/guides/leveling-automation"
				htmlFor="xpFromCommands"
				tooltip="Choose if members can gain experience from bot commands."
			>
				Allow members to gain experience from bot commands?{" "}
			</Text>

			<Toggle id="xpFromCommands" initialValue={defaultValue} />
		</div>
	);
}
