import { Text } from "@/components/dashboard/Text.tsx";
import { Toggle } from "@/components/Toggle.tsx";

export function VoiceXpDisallowMuted({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text htmlFor="voiceXpDisallowMuted">Exclude muted members from the active participant count? </Text>

			<Toggle id="voiceXpDisallowMuted" initialValue={defaultValue} />
		</div>
	);
}
