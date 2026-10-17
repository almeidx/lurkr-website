"use client";

import { Slider } from "@/components/dashboard/Slider.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { MAX_VOICE_XP_REJOIN_GRACE_PERIOD } from "@/lib/guild-config.ts";
import { formatMinutes, parseMinutes } from "@/utils/minute-slider-text.ts";

const STEPS = ["0", "5m", "10m", "15m", "20m", "25m", "30m"];

export function VoiceXpRejoinGracePeriod({ defaultValue }: VoiceXpRejoinGracePeriodProps) {
	const defaultValueInMinutes = defaultValue ? Math.round(defaultValue / 1_000 / 60) : 0;

	return (
		<>
			<Text>Let members who rejoin voice shortly after leaving continue their session within…</Text>

			<Slider
				defaultValue={defaultValueInMinutes}
				id="voiceXpRejoinGracePeriod"
				max={MAX_VOICE_XP_REJOIN_GRACE_PERIOD}
				min={0}
				mobileStepsToHide={[1, 3, 5]}
				step={1}
				steps={STEPS}
				text={{ format: formatMinutes, parse: parseMinutes }}
			/>

			<div className="text-sm text-white/60">
				<p>
					Set to 0 to always start a new session. Rejoining in time continues the previous session, so brief disconnects
					don't trigger the session cooldown and rejoining doesn't reset the maximum session length.
				</p>
			</div>
		</>
	);
}

interface VoiceXpRejoinGracePeriodProps {
	readonly defaultValue: number | null;
}
