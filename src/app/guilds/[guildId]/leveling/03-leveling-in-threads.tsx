import { Toggle } from "@/components/Toggle.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function LevelingInThreads({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text docsPath="/guides/setting-up-server-leveling#toggling-leveling-in-threads" htmlFor="xpInThreads">
				Toggle Leveling in Channel Threads?{" "}
			</Text>

			<Toggle initialValue={defaultValue} id="xpInThreads" />
		</div>
	);
}
