import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { MAX_VOICE_XP_PER_MINUTE, MIN_VOICE_XP_PER_MINUTE } from "@/lib/guild-config.ts";

export function VoiceXpPerMinuteRange({ defaultMin, defaultMax }: VoiceXpPerMinuteRangeProps) {
	return (
		<div className="flex flex-col gap-4">
			<Label>Set the XP range awarded per minute in a voice channel…</Label>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
				<div className="flex flex-col gap-2">
					<Label sub={`Between ${MIN_VOICE_XP_PER_MINUTE}-${MAX_VOICE_XP_PER_MINUTE}`}>Minimum XP</Label>
					<Input
						defaultValue={defaultMin}
						id="voiceXpPerMinuteMin"
						max={MAX_VOICE_XP_PER_MINUTE}
						min={MIN_VOICE_XP_PER_MINUTE}
						placeholder={`Min XP (${MIN_VOICE_XP_PER_MINUTE}-${MAX_VOICE_XP_PER_MINUTE})`}
						type="number"
					/>
				</div>

				<div className="hidden items-center justify-center md:flex">
					<div className="h-16 w-px bg-white/20" />
				</div>

				<div className="flex flex-col gap-2">
					<Label sub={`Between ${MIN_VOICE_XP_PER_MINUTE}-${MAX_VOICE_XP_PER_MINUTE}`}>Maximum XP</Label>
					<Input
						defaultValue={defaultMax}
						id="voiceXpPerMinuteMax"
						max={MAX_VOICE_XP_PER_MINUTE}
						min={MIN_VOICE_XP_PER_MINUTE}
						placeholder={`Max XP (${MIN_VOICE_XP_PER_MINUTE}-${MAX_VOICE_XP_PER_MINUTE})`}
						type="number"
					/>
				</div>
			</div>

			<div className="text-sm text-white/60">
				<p>
					Default: 15-40 XP per minute. This range is separate from the message XP range, so you can tune voice and text
					leveling independently.
				</p>
			</div>
		</div>
	);
}

interface VoiceXpPerMinuteRangeProps {
	readonly defaultMin: number;
	readonly defaultMax: number;
}
