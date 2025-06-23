import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function LevelingInThreads({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text
				docsPath="/guides/leveling-automation#toggling-leveling-in-threads"
				htmlFor="xpInThreads"
				tooltip="Choose if members can gain experience in threads/posts created in channels that are leveling channels."
			>
				Allow members to gain experience in threads?{" "}
			</Text>

			<Toggle id="xpInThreads" initialValue={defaultValue} />
		</div>
	);
}
