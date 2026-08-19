import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { MIN_VOICE_XP_MIN_GROUP_COUNT } from "@/lib/guild-config.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";

export function VoiceXpMinGroupCount({ defaultValue, premium }: VoiceXpMinGroupCountProps) {
	return (
		<>
			<Text>Set how many active members a voice channel needs before XP is counted…</Text>

			<Input
				defaultValue={defaultValue}
				id="voiceXpMinGroupCount"
				max={getMaximumLimit("voiceXpMinGroupCount", premium)}
				min={MIN_VOICE_XP_MIN_GROUP_COUNT}
				placeholder="Enter a whole number…"
				required
				type="number"
			/>
		</>
	);
}

interface VoiceXpMinGroupCountProps {
	readonly defaultValue: number;
	readonly premium: boolean;
}
