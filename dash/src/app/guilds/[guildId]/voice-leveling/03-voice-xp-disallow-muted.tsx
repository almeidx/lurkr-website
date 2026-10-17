import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function VoiceXpDisallowMuted({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<>
			<div className="flex h-6 gap-4 rounded-lg">
				<Text htmlFor="voiceXpDisallowMuted">Exclude muted members from voice leveling? </Text>

				<Toggle id="voiceXpDisallowMuted" initialValue={defaultValue} />
			</div>

			<div className="text-sm text-white/60">
				<p>
					When on, muted members don't earn voice XP or count toward the minimum group count. Deafened members never do.
				</p>
			</div>
		</>
	);
}
