import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function XpFromCommands({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex gap-4">
			<Text htmlFor="xpFromCommands">Allow members to gain experience from bot slash commands?</Text>
			<Toggle id="xpFromCommands" initialValue={defaultValue} />
		</div>
	);
}
